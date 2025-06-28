// app/api/spotify/canvas/[id]/route.ts

import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const trackId = params.id;
    const PAXSENIX_API_KEY = process.env.PAXSENIX_API_KEY;

    if (!trackId) {
        return NextResponse.json({ error: 'Track ID is required' }, { status: 400 });
    }

    if (!PAXSENIX_API_KEY) {
        return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
    }

    try {
        const response = await fetch(`https://api.paxsenix.biz.id/spotify/canvas?id=${trackId}`, {
            headers: {
                'Authorization': `Bearer ${PAXSENIX_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: 'Failed to fetch canvas data', details: errorData }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
