import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase';
import { authenticateRequest, checkRateLimit } from '@/utils/auth';
import crypto from 'crypto';

interface AnalyticsEvent {
    event: string;
    page: string;
    timestamp: number;
    userAgent: string;
    referrer: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    sessionId?: string;
}

// Hash IP address for privacy
function hashIP(ip: string): string {
    return crypto.createHash('sha256').update(ip + process.env.ANALYTICS_JWT_SECRET).digest('hex');
}

function getDeviceType(userAgent: string): string {
    if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        if (/iPad/i.test(userAgent)) return 'Tablet';
        return 'Mobile';
    }
    return 'Desktop';
}

// Get country from IP (simplified - in production use a proper GeoIP service)
function getCountryFromIP(ip: string): string {
    // In production, integrate with a GeoIP service like MaxMind or ipapi
    // For now, return unknown
    return 'Unknown';
}

export async function POST(request: NextRequest) {
    try {
        // Get client IP
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                  request.headers.get('x-real-ip') || 
                  request.headers.get('cf-connecting-ip') ||
                  'unknown';
        
        // Rate limiting for analytics events
        if (!checkRateLimit(ip, 100, 15 * 60 * 1000)) { // 100 events per 15 minutes
            return NextResponse.json(
                { error: 'Rate limit exceeded' },
                { status: 429 }
            );
        }

        const data: AnalyticsEvent = await request.json();
        
        // Validate required fields
        if (!data.event || !data.page || !data.timestamp) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const userAgent = request.headers.get('user-agent') || '';
        const device = getDeviceType(userAgent);
        const country = getCountryFromIP(ip);
        const hashedIP = hashIP(ip);

        // Insert event into database
        const { error: eventError } = await supabaseAdmin
            .from('analytics_events')
            .insert({
                event: data.event,
                page: data.page,
                timestamp: new Date(data.timestamp).toISOString(),
                user_agent: userAgent,
                referrer: data.referrer || null,
                ip_address: hashedIP,
                country,
                device,
                utm_source: data.utm_source || null,
                utm_medium: data.utm_medium || null,
                utm_campaign: data.utm_campaign || null,
                utm_term: data.utm_term || null,
                utm_content: data.utm_content || null,
                session_id: data.sessionId || null,
            });

        if (eventError) {
            console.error('Database error:', eventError);
            return NextResponse.json(
                { error: 'Failed to save analytics event' },
                { status: 500 }
            );
        }

        // Update or create session if sessionId is provided
        if (data.sessionId && data.event === 'page_view') {
            await updateSession(data.sessionId, data.page, hashedIP, userAgent, device, country);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        // Authenticate request
        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('range') || '7d';
        const eventType = searchParams.get('event');
        
        // Calculate time range
        const now = new Date();
        const ranges = {
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000,
            '90d': 90 * 24 * 60 * 60 * 1000,
        };
        
        const timeRangeMs = ranges[timeRange as keyof typeof ranges] || ranges['7d'];
        const startTime = new Date(now.getTime() - timeRangeMs).toISOString();
        
        // Build query
        let query = supabaseAdmin
            .from('analytics_events')
            .select('*')
            .gte('timestamp', startTime)
            .order('timestamp', { ascending: false });
        
        if (eventType) {
            query = query.eq('event', eventType);
        }
        
        const { data: events, error } = await query;
        
        if (error) {
            console.error('Database query error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch analytics data' },
                { status: 500 }
            );
        }

        // Process analytics data
        const analytics = await processAnalyticsData(events || [], startTime);
        
        return NextResponse.json(analytics);
    } catch (error) {
        console.error('Analytics GET API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function updateSession(sessionId: string, currentPage: string, hashedIP: string, userAgent: string, device: string, country: string) {
    try {
        // Check if session exists
        const { data: existingSession } = await supabaseAdmin
            .from('analytics_sessions')
            .select('*')
            .eq('session_id', sessionId)
            .single();

        if (existingSession) {
            // Update existing session
            await supabaseAdmin
                .from('analytics_sessions')
                .update({
                    last_page: currentPage,
                    page_count: existingSession.page_count + 1,
                    ended_at: new Date().toISOString(),
                })
                .eq('session_id', sessionId);
        } else {
            // Create new session
            await supabaseAdmin
                .from('analytics_sessions')
                .insert({
                    session_id: sessionId,
                    ip_address: hashedIP,
                    user_agent: userAgent,
                    country,
                    device,
                    first_page: currentPage,
                    last_page: currentPage,
                    page_count: 1,
                    started_at: new Date().toISOString(),
                    ended_at: new Date().toISOString(),
                });
        }
    } catch (error) {
        console.error('Session update error:', error);
    }
}

async function processAnalyticsData(events: any[], startTime: string) {
    const pageViews = events.filter(e => e.event === 'page_view');
    
    // Get unique visitors from sessions
    const { data: sessions } = await supabaseAdmin
        .from('analytics_sessions')
        .select('ip_address')
        .gte('started_at', startTime);
    
    const uniqueVisitors = new Set(sessions?.map(s => s.ip_address) || []).size;
    
    // Top pages
    const pageStats = pageViews.reduce((acc, event) => {
        acc[event.page] = (acc[event.page] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const topPages = Object.entries(pageStats)
        .sort(([,a], [,b]) => {
            const numA = a as number;
            const numB = b as number;
            return numB - numA;
        })
        .slice(0, 10)
        .map(([page, views]) => {
            const viewCount = views as number;
            return {
            page,
            views: viewCount,
            percentage: pageViews.length > 0 ? (viewCount / pageViews.length) * 100 : 0
        };
        });
    
    // Traffic sources
    const sources = pageViews.reduce((acc, event) => {
        let source = 'Direct';
        if (event.utm_source) {
            source = event.utm_source;
        } else if (event.referrer && event.referrer !== '') {
            try {
                const domain = new URL(event.referrer).hostname;
                if (domain.includes('google')) source = 'Google Search';
                else if (domain.includes('instagram')) source = 'Instagram';
                else if (domain.includes('youtube')) source = 'YouTube';
                else if (domain.includes('linkedin')) source = 'LinkedIn';
                else source = 'Other';
            } catch {
                source = 'Other';
            }
        }
        acc[source] = (acc[source] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const trafficSources = Object.entries(sources)
        .sort(([,a], [,b]) => {
            const numA = a as number;
            const numB = b as number;
            return numB - numA;
        })
        .map(([source, visitors]) => {
            const visitorCount = visitors as number;
            return {
            source,
            visitors: visitorCount,
            percentage: pageViews.length > 0 ? (visitorCount / pageViews.length) * 100 : 0
        };
        });
    
    // UTM Campaigns
    const campaigns = pageViews
        .filter(e => e.utm_campaign)
        .reduce((acc, event) => {
            const campaign = event.utm_campaign!;
            if (!acc[campaign]) {
                acc[campaign] = { visitors: 0, conversions: 0 };
            }
            acc[campaign].visitors++;
            return acc;
        }, {} as Record<string, { visitors: number; conversions: number }>);
    
    const utmCampaigns = Object.entries(campaigns)
        .map(([campaign, data]) => ({
            campaign,
            visitors: data.visitors,
            conversions: Math.floor(data.visitors * 0.1), // Mock conversion rate
        }));
    
    // Device types
    const devices = pageViews.reduce((acc, event) => {
        const device = event.device || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const deviceTypes = Object.entries(devices)
        .map(([device, visitors]) => {
            const visitorCount = visitors as number;
            return {
            device,
            visitors: visitorCount,
            percentage: pageViews.length > 0 ? (visitorCount / pageViews.length) * 100 : 0
        };
        });

    // Countries
    const countries = pageViews.reduce((acc, event) => {
        const country = event.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const topCountries = Object.entries(countries)
        .sort(([,a], [,b]) => {
            const numA = a as number;
            const numB = b as number;
            return numB - numA;
        })
        .slice(0, 6)
        .map(([country, visitors]) => {
            const visitorCount = visitors as number;
            return {
            country,
            visitors: visitorCount,
            percentage: pageViews.length > 0 ? (visitorCount / pageViews.length) * 100 : 0
        };
        });

    return {
        totalVisitors: pageViews.length,
        totalPageViews: pageViews.length,
        uniqueVisitors,
        bounceRate: 34.2, // Calculate from sessions data
        avgSessionDuration: '2m 34s', // Calculate from sessions data
        topPages,
        trafficSources,
        utmCampaigns,
        deviceTypes,
        countries: topCountries,
        hourlyTraffic: Array.from({ length: 24 }, (_, hour) => ({
            hour,
            visitors: Math.floor(Math.random() * 100) + 50 // TODO: Replace with real data
        })),
        dailyTraffic: Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
                date: date.toISOString().split('T')[0],
                visitors: Math.floor(Math.random() * 500) + 200, // TODO: Replace with real data
                pageViews: Math.floor(Math.random() * 1000) + 400,
            };
        }),
    };
}