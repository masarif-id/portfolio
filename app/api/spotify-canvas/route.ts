import { NextRequest, NextResponse } from 'next/server';

const PAXSENIX_API_KEY = process.env.PAXSENIX_API_KEY;
const PAXSENIX_BASE_URL = 'https://api.paxsenix.biz.id';

export async function GET(request: NextRequest) {
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
            throw new Error(`Failed to fetch canvas: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching canvas:', error);
        return NextResponse.json({ error: 'Failed to fetch canvas' }, { status: 500 });
    }
}