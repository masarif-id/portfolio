import { NextRequest, NextResponse } from 'next/server';

const PAXSENIX_API_KEY = 'sk-paxsenix-gei_upAIzTyaAej248YuesU4p5RNB-azx2NZUBL-jLcgZk9B';
const PAXSENIX_BASE_URL = 'https://api.paxsenix.biz.id';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const trackId = searchParams.get('id');
    const trackUrl = searchParams.get('url');

    console.log('Lyrics API called with trackId:', trackId, 'trackUrl:', trackUrl);

    if (!trackId && !trackUrl) {
        return NextResponse.json({ error: 'Track ID or URL is required' }, { status: 400 });
    }

    try {
        const params = new URLSearchParams();
        if (trackId) params.append('id', trackId);
        if (trackUrl) params.append('url', trackUrl);

        // Using the correct endpoint from documentation: /lyrics
        const url = `${PAXSENIX_BASE_URL}/lyrics?${params.toString()}`;
        console.log('Fetching lyrics from:', url);

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${PAXSENIX_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Lyrics API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Lyrics API error: ${response.status} - ${errorText}`);
            
            if (response.status === 404) {
                return NextResponse.json({ 
                    error: 'Lyrics not found for this track',
                    lyrics: null 
                }, { status: 200 });
            }
            
            return NextResponse.json({ 
                error: `API error: ${response.status}`,
                lyrics: null 
            }, { status: 200 });
        }

        const data = await response.json();
        console.log('Lyrics data received:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch lyrics',
            lyrics: null 
        }, { status: 200 });
    }
}