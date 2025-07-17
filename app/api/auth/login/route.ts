import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, checkRateLimit } from '@/utils/auth';

const ADMIN_EMAIL = process.env.ANALYTICS_ADMIN_EMAIL!;

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || 
                  request.headers.get('cf-connecting-ip') ||
                  'unknown';
        
        if (!checkRateLimit(ip, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
            return NextResponse.json(
                { error: 'Too many login attempts. Please try again later.' },
                { status: 429 }
            );
        }

        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Check credentials
        if (email !== ADMIN_EMAIL) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isValidPassword = await verifyPassword(password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Generate token
        const user = { email: ADMIN_EMAIL, role: 'admin' as const };
        const token = generateToken(user);

        // Set cookie and return token
        const response = NextResponse.json({ 
            success: true, 
            user,
            token 
        });

        response.cookies.set('analytics-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60, // 24 hours
            path: '/'
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}