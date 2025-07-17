import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.ANALYTICS_JWT_SECRET!;
const ADMIN_EMAIL = process.env.ANALYTICS_ADMIN_EMAIL!;
const ADMIN_PASSWORD_HASH = process.env.ANALYTICS_ADMIN_PASSWORD_HASH!;

export interface AuthUser {
    email: string;
    role: 'admin';
}

export async function verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

export function generateToken(user: AuthUser): string {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AuthUser | null {
    try {
        return jwt.verify(token, JWT_SECRET) as AuthUser;
    } catch {
        return null;
    }
}

export function getTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    
    // Also check cookies for browser requests
    const cookieToken = request.cookies.get('analytics-token')?.value;
    return cookieToken || null;
}

export async function authenticateRequest(request: NextRequest): Promise<AuthUser | null> {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    
    return verifyToken(token);
}

// Helper untuk generate password hash (gunakan sekali untuk setup)
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

// Rate limiting helper
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, maxRequests = 100, windowMs = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const key = ip;
    
    const current = rateLimitMap.get(key);
    
    if (!current || now > current.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
        return true;
    }
    
    if (current.count >= maxRequests) {
        return false;
    }
    
    current.count++;
    return true;
}