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

    if (!trackId) {
        return NextResponse.json({ error: 'Track ID is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`${PAXSENIX_BASE_URL}/spotify/canvas?id=${trackId}`, {
            headers: {
                'Authorization': `Bearer ${PAXSENIX_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Paxsenix API error: ${response.status} - ${response.statusText || 'No status text provided'}`);
            
            if (response.status === 404) {
                return NextResponse.json({ 
                    error: 'Canvas not found for the provided track' 
                }, { status: 404 });
            } else if (response.status === 401) {
                return NextResponse.json({ 
                    error: 'API authentication failed' 
                }, { status: 500 });
            } else if (response.status === 500) {
                return NextResponse.json({ 
                    error: 'External service temporarily unavailable' 
                }, { status: 503 });
            } else {
                return NextResponse.json({ 
                    error: 'Failed to fetch canvas from external service' 
                }, { status: 500 });
            }
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching canvas:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch canvas from external service' 
        }, { status: 500 });
    }
}