import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json({ error: 'Admin password not configured' }, { status: 500 });
        }

        if (password === adminPassword) {
            const response = NextResponse.json({ success: true });
            response.cookies.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24,
            });
            return response;
        }

        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('admin_session');
    return response;
}
