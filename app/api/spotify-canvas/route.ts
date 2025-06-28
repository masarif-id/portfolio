import { NextRequest, NextResponse } from 'next/server';

const PAXSENIX_API_KEY = 'sk-paxsenix-gei_upAIzTyaAej248YuesU4p5RNB-azx2NZUBL-jLcgZk9B';
const PAXSENIX_BASE_URL = 'https://api.paxsenix.biz.id';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const trackId = searchParams.get('id');

    console.log('Canvas API called with trackId:', trackId);

    if (!trackId) {
        return NextResponse.json({ error: 'Track ID is required' }, { status: 400 });
    }

    try {
        // Using the correct endpoint from documentation: /spotify
        const url = `${PAXSENIX_BASE_URL}/spotify?id=${trackId}`;
        console.log('Fetching canvas from:', url);

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${PAXSENIX_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('Canvas API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Canvas API error: ${response.status} - ${errorText}`);
            
            if (response.status === 404) {
                return NextResponse.json({ 
                    error: 'Canvas not found for this track',
                    canvas_url: null 
                }, { status: 200 });
            }
            
            return NextResponse.json({ 
                error: `API error: ${response.status}`,
                canvas_url: null 
            }, { status: 200 });
        }

        const data = await response.json();
        console.log('Canvas data received:', data);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching canvas:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch canvas',
            canvas_url: null 
        }, { status: 200 });
    }
}