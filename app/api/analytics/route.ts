import { NextRequest, NextResponse } from 'next/server';

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
    ip?: string;
    country?: string;
    device?: string;
}

// In production, you would store this in a database
let analyticsEvents: AnalyticsEvent[] = [];

export async function POST(request: NextRequest) {
    try {
        const data: AnalyticsEvent = await request.json();
        
        // Add additional server-side data
        const ip = request.ip || 
                  request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  'unknown';
        
        const userAgent = request.headers.get('user-agent') || '';
        
        // Simple device detection
        const device = getDeviceType(userAgent);
        
        // In production, you might want to get country from IP
        const country = 'Unknown'; // You could use a GeoIP service here
        
        const enrichedData: AnalyticsEvent = {
            ...data,
            ip,
            country,
            device,
            userAgent,
        };
        
        // Store the event (in production, save to database)
        analyticsEvents.push(enrichedData);
        
        // Keep only last 10000 events in memory
        if (analyticsEvents.length > 10000) {
            analyticsEvents = analyticsEvents.slice(-10000);
        }
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { error: 'Failed to process analytics event' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const timeRange = searchParams.get('range') || '7d';
        const eventType = searchParams.get('event');
        
        // Calculate time range
        const now = Date.now();
        const ranges = {
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000,
            '90d': 90 * 24 * 60 * 60 * 1000,
        };
        
        const timeRangeMs = ranges[timeRange as keyof typeof ranges] || ranges['7d'];
        const startTime = now - timeRangeMs;
        
        // Filter events
        let filteredEvents = analyticsEvents.filter(event => 
            event.timestamp >= startTime
        );
        
        if (eventType) {
            filteredEvents = filteredEvents.filter(event => 
                event.event === eventType
            );
        }
        
        // Process analytics data
        const analytics = processAnalyticsData(filteredEvents);
        
        return NextResponse.json(analytics);
    } catch (error) {
        console.error('Analytics GET API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data' },
            { status: 500 }
        );
    }
}

function getDeviceType(userAgent: string): string {
    if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        if (/iPad/i.test(userAgent)) return 'Tablet';
        return 'Mobile';
    }
    return 'Desktop';
}

function processAnalyticsData(events: AnalyticsEvent[]) {
    const pageViews = events.filter(e => e.event === 'page_view');
    const uniqueVisitors = new Set(pageViews.map(e => e.ip)).size;
    
    // Top pages
    const pageStats = pageViews.reduce((acc, event) => {
        acc[event.page] = (acc[event.page] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const topPages = Object.entries(pageStats)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([page, views]) => ({
            page,
            views,
            percentage: (views / pageViews.length) * 100
        }));
    
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
        .sort(([,a], [,b]) => b - a)
        .map(([source, visitors]) => ({
            source,
            visitors,
            percentage: (visitors / pageViews.length) * 100
        }));
    
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
        const device = event.device || getDeviceType(event.userAgent);
        acc[device] = (acc[device] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    
    const deviceTypes = Object.entries(devices)
        .map(([device, visitors]) => ({
            device,
            visitors,
            percentage: (visitors / pageViews.length) * 100
        }));
    
    return {
        totalVisitors: pageViews.length,
        totalPageViews: pageViews.length,
        uniqueVisitors,
        bounceRate: 34.2, // Mock data
        avgSessionDuration: '2m 34s', // Mock data
        topPages,
        trafficSources,
        utmCampaigns,
        deviceTypes,
        countries: [
            { country: 'Indonesia', visitors: Math.floor(pageViews.length * 0.6), percentage: 60 },
            { country: 'Malaysia', visitors: Math.floor(pageViews.length * 0.2), percentage: 20 },
            { country: 'Others', visitors: Math.floor(pageViews.length * 0.2), percentage: 20 },
        ],
        hourlyTraffic: Array.from({ length: 24 }, (_, hour) => ({
            hour,
            visitors: Math.floor(Math.random() * 100) + 50
        })),
        dailyTraffic: Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
                date: date.toISOString().split('T')[0],
                visitors: Math.floor(Math.random() * 500) + 200,
                pageViews: Math.floor(Math.random() * 1000) + 400,
            };
        }),
    };
}