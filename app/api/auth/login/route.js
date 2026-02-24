import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

// ─── Rate Limiter ──────────────────────────────────────────────────
// In-memory rate limiter: 5 attempts per IP per 15 minutes
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip) {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (!record || now - record.firstAttempt > WINDOW_MS) {
        loginAttempts.set(ip, { count: 1, firstAttempt: now });
        return true;
    }

    if (record.count >= MAX_ATTEMPTS) {
        const remaining = Math.ceil((record.firstAttempt + WINDOW_MS - now) / 1000 / 60);
        return remaining; // returns minutes remaining
    }

    record.count++;
    return true;
}

// Clean up old entries every 30 minutes
if (typeof globalThis.__rateLimitCleanup === 'undefined') {
    globalThis.__rateLimitCleanup = setInterval(() => {
        const now = Date.now();
        for (const [ip, record] of loginAttempts) {
            if (now - record.firstAttempt > WINDOW_MS) loginAttempts.delete(ip);
        }
    }, 30 * 60 * 1000);
}

export async function POST(request) {
    try {
        // Rate limit check
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const allowed = checkRateLimit(ip);
        if (allowed !== true) {
            return NextResponse.json(
                { error: `Too many login attempts. Try again in ${allowed} minute(s).` },
                { status: 429 }
            );
        }

        const { userId, password } = await request.json();

        if (!userId || !password) {
            return NextResponse.json({ error: 'User ID/Email and password are required' }, { status: 400 });
        }

        let user = null;
        const dbAvailable = await tryDb();
        const input = userId.trim();

        if (dbAvailable) {
            const User = (await import('@/lib/models/User')).default;
            // Try matching by userId (case-insensitive) or by email
            user = await User.findOne({
                $or: [
                    { userId: input.toUpperCase() },
                    { email: input.toLowerCase() },
                ]
            });
        } else {
            const { findUserByUserId, getStore } = await import('@/lib/memoryStore');
            // Try userId first, then email
            user = findUserByUserId(input.toUpperCase());
            if (!user) {
                const store = getStore();
                user = store.users.find(u => u.email && u.email.toLowerCase() === input.toLowerCase()) || null;
            }
        }

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcryptjs.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await signToken({
            userId: user.userId,
            name: user.name,
            role: user.role,
        });

        const response = NextResponse.json({
            success: true,
            token,
            needsPasswordSetup: user.needsPasswordSetup || false,
            user: {
                userId: user.userId,
                name: user.name,
                role: user.role,
            },
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 86400,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
