import { NextRequest, NextResponse } from 'next/server';

const PAXSENIX_API_KEY = process.env.PAXSENIX_API_KEY;
const PAXSENIX_BASE_URL = 'https://api.paxsenix.biz.id';

export async function GET(request: NextRequest) {
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
            throw new Error(`Failed to fetch lyrics: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        return NextResponse.json({ error: 'Failed to fetch lyrics' }, { status: 500 });
    }
}