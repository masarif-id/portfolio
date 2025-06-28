import { NextRequest, NextResponse } from 'next/server';

const PAXSENIX_API_KEY = process.env.PAXSENIX_API_KEY;
const PAXSENIX_BASE_URL = 'https://api.paxsenix.biz.id';

export async function GET(request: NextRequest) {
    // Check if required environment variables are defined
    if (!PAXSENIX_API_KEY || !PAXSENIX_BASE_URL) {
        console.error('Missing required environment variables: PAXSENIX_API_KEY or PAXSENIX_BASE_URL');
        return NextResponse.json({ 
            error: 'Server configuration error: Missing required API credentials' 
        }, { status: 500 });
    }

    const searchParams = request.nextUrl.searchParams;
    const trackId = searchParams.get('id');
    const trackUrl = searchParams.get('url');

    if (!trackId && !trackUrl) {
        return NextResponse.json({ error: 'Track ID or URL is required' }, { status: 400 });
    }

    try {
        const params = new URLSearchParams();
        if (trackId) params.append('id', trackId);
        if (trackUrl) params.append('url', trackUrl);

        const response = await fetch(`${PAXSENIX_BASE_URL}/lyrics/spotify?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${PAXSENIX_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Paxsenix API error: ${response.status} - ${response.statusText}`);
            
            if (response.status === 404) {
                return NextResponse.json({ 
                    error: 'Lyrics not found for the provided track' 
                }, { status: 404 });
            }
            
            if (response.status === 401) {
                return NextResponse.json({ 
                    error: 'API authentication failed' 
                }, { status: 500 });
            }
            
            throw new Error(`Failed to fetch lyrics: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch lyrics from external service' 
        }, { status: 500 });
    }
}