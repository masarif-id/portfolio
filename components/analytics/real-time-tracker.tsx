'use client';

import { useEffect, useState } from 'react';

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

// Generate session ID
function generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Get or create session ID
function getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
}

export default function RealTimeTracker() {
    const [sessionId] = useState(() => {
        if (typeof window !== 'undefined') {
            return getSessionId();
        }
        return '';
    });

    useEffect(() => {
        if (!sessionId) return;

        // Track page view
        const trackPageView = () => {
            const urlParams = new URLSearchParams(window.location.search);
            
            const analyticsData: AnalyticsEvent = {
                event: 'page_view',
                page: window.location.pathname,
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                utm_source: urlParams.get('utm_source') || undefined,
                utm_medium: urlParams.get('utm_medium') || undefined,
                utm_campaign: urlParams.get('utm_campaign') || undefined,
                utm_term: urlParams.get('utm_term') || undefined,
                utm_content: urlParams.get('utm_content') || undefined,
                sessionId,
            };

            // Send to analytics endpoint
            sendAnalyticsEvent(analyticsData);
        };

        // Track clicks on external links
        const trackExternalLinks = () => {
            document.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                const link = target.closest('a');
                
                if (link && link.href && !link.href.startsWith(window.location.origin)) {
                    const analyticsData: AnalyticsEvent = {
                        event: 'external_link_click',
                        page: window.location.pathname,
                        timestamp: Date.now(),
                        userAgent: navigator.userAgent,
                        referrer: link.href,
                        sessionId,
                    };
                    
                    sendAnalyticsEvent(analyticsData);
                }
            });
        };

        // Track scroll depth
        const trackScrollDepth = () => {
            let maxScroll = 0;
            let scrollTimer: NodeJS.Timeout;

            const handleScroll = () => {
                const scrollPercent = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );
                
                if (scrollPercent > maxScroll) {
                    maxScroll = scrollPercent;
                    
                    clearTimeout(scrollTimer);
                    scrollTimer = setTimeout(() => {
                        if (maxScroll >= 25 && maxScroll % 25 === 0) {
                            const analyticsData: AnalyticsEvent = {
                                event: 'scroll_depth',
                                page: window.location.pathname,
                                timestamp: Date.now(),
                                userAgent: navigator.userAgent,
                                referrer: `${maxScroll}%`,
                                sessionId,
                            };
                            
                            sendAnalyticsEvent(analyticsData);
                        }
                    }, 1000);
                }
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            
            return () => {
                window.removeEventListener('scroll', handleScroll);
                clearTimeout(scrollTimer);
            };
        };

        // Track time on page
        const trackTimeOnPage = () => {
            const startTime = Date.now();
            
            const sendTimeOnPage = () => {
                const timeSpent = Date.now() - startTime;
                
                if (timeSpent > 30000) { // Only track if user spent more than 30 seconds
                    const analyticsData: AnalyticsEvent = {
                        event: 'time_on_page',
                        page: window.location.pathname,
                        timestamp: Date.now(),
                        userAgent: navigator.userAgent,
                        referrer: `${Math.round(timeSpent / 1000)}s`,
                        sessionId,
                    };
                    
                    sendAnalyticsEvent(analyticsData);
                }
            };

            // Track when user leaves the page
            window.addEventListener('beforeunload', sendTimeOnPage);
            
            return () => {
                window.removeEventListener('beforeunload', sendTimeOnPage);
            };
        };

        trackPageView();
        trackExternalLinks();
        const cleanupScroll = trackScrollDepth();
        const cleanupTime = trackTimeOnPage();

        return () => {
            cleanupScroll();
            cleanupTime();
        };
    }, [sessionId]);

    return null; // This component doesn't render anything
}

async function sendAnalyticsEvent(data: AnalyticsEvent) {
    try {
        // Send to analytics API
        await fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Failed to send analytics event:', error);
    }
}