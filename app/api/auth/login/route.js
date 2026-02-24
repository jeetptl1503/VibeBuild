import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function POST(request) {
    try {
        const { userId, password } = await request.json();

        if (!userId || !password) {
            return NextResponse.json({ error: 'User ID and password are required' }, { status: 400 });
        }

        let user = null;
        const dbAvailable = await tryDb();

        if (dbAvailable) {
            const User = (await import('@/lib/models/User')).default;
            user = await User.findOne({ userId: userId.toUpperCase() });
        } else {
            const { findUserByUserId } = await import('@/lib/memoryStore');
            user = findUserByUserId(userId.toUpperCase());
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
