// app/api/spotify/canvas/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
    const trackId = context.params.id;
    const PAXSENIX_API_KEY = process.env.PAXSENIX_API_KEY;

    try {
        const response = await fetch(`https://api.paxsenix.biz.id/spotify/canvas?id=${trackId}`, {
            headers: { 'Authorization': `Bearer ${PAXSENIX_API_KEY}` },
        });
        if (!response.ok) throw new Error('Failed to fetch canvas');
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Canvas not found' }, { status: 404 });
    }
}
