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
        // Try different endpoint formats based on documentation
        const endpoints = [
            `/spotify/canvas?id=${trackId}`,
            `/spotify?type=canvas&id=${trackId}`,
            `/spotify?canvas=${trackId}`,
            `/canvas?id=${trackId}`,
        ];

        let lastError = '';
        
        for (const endpoint of endpoints) {
            const url = `${PAXSENIX_BASE_URL}${endpoint}`;
            console.log(`Trying canvas endpoint: ${url}`);

            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${PAXSENIX_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log(`Response status for ${endpoint}:`, response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Canvas data received:', data);
                    return NextResponse.json(data);
                }

                const errorText = await response.text();
                lastError = `${response.status} - ${errorText}`;
                console.log(`Error for ${endpoint}:`, lastError);

                // If it's not a 404, continue trying other endpoints
                if (response.status !== 404) {
                    continue;
                }
            } catch (fetchError) {
                console.error(`Fetch error for ${endpoint}:`, fetchError);
                lastError = `Fetch error: ${fetchError}`;
                continue;
            }
        }

        // If all endpoints failed, return the last error
        console.error('All canvas endpoints failed. Last error:', lastError);
        return NextResponse.json({ 
            error: `All endpoints failed. Last error: ${lastError}`,
            canvas_url: null,
            debug: {
                trackId,
                triedEndpoints: endpoints,
                lastError
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching canvas:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch canvas',
            canvas_url: null,
            debug: {
                trackId,
                error: error.toString()
            }
        }, { status: 200 });
    }
}