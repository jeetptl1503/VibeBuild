import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function POST(request) {
    try {
        const admin = await authenticateRequest(request);
        if (!admin || admin.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { userId, password, name, email } = await request.json();

        if (!userId || !password || !name) {
            return NextResponse.json({ error: 'User ID, password, and name are required' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const User = (await import('@/lib/models/User')).default;
            const existing = await User.findOne({ userId: userId.toUpperCase() });
            if (existing) return NextResponse.json({ error: 'User ID already exists' }, { status: 400 });

            if (email) {
                const emailExists = await User.findOne({ email: email.toLowerCase() });
                if (emailExists) return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
            }

            const newUser = await User.create({
                userId: userId.toUpperCase(),
                password: hashedPassword,
                name,
                email: email ? email.toLowerCase() : null,
                role: 'participant',
            });

            return NextResponse.json({
                participant: { userId: newUser.userId, name: newUser.name, email: newUser.email }
            }, { status: 201 });
        } else {
            const { findUserByUserId, addUser, getStore } = await import('@/lib/memoryStore');
            if (findUserByUserId(userId.toUpperCase())) {
                return NextResponse.json({ error: 'User ID already exists' }, { status: 400 });
            }

            if (email) {
                const store = getStore();
                const emailExists = store.users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase());
                if (emailExists) return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
            }

            addUser({
                userId: userId.toUpperCase(),
                password: hashedPassword,
                name,
                email: email ? email.toLowerCase() : null,
                role: 'participant',
                needsPasswordSetup: false,
            });

            return NextResponse.json({
                participant: { userId: userId.toUpperCase(), name, email: email || null }
            }, { status: 201 });
        }
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
