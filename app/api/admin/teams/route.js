import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

// GET — list all participants
export async function GET(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const User = (await import('@/lib/models/User')).default;
            const users = await User.find({ role: 'participant' }).select('-password').sort({ userId: 1 });
            return NextResponse.json({ participants: users });
        } else {
            const { getUsers } = await import('@/lib/memoryStore');
            return NextResponse.json({ participants: getUsers('participant') });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST — add a participant
export async function POST(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { userId, password, name } = body;

        if (!userId || !password || !name) {
            return NextResponse.json({ error: 'User ID, password, and name are required' }, { status: 400 });
        }

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const User = (await import('@/lib/models/User')).default;
            const existing = await User.findOne({ userId: userId.toUpperCase() });
            if (existing) return NextResponse.json({ error: 'User ID already exists' }, { status: 400 });
            const hashedPassword = await bcryptjs.hash(password, 10);
            const newUser = await User.create({ userId: userId.toUpperCase(), password: hashedPassword, name, role: 'participant' });
            return NextResponse.json({ participant: { userId: newUser.userId, name: newUser.name } }, { status: 201 });
        } else {
            const { findUserByUserId, addUser } = await import('@/lib/memoryStore');
            if (findUserByUserId(userId.toUpperCase())) return NextResponse.json({ error: 'User ID already exists' }, { status: 400 });
            const hashedPassword = await bcryptjs.hash(password, 10);
            addUser({ userId: userId.toUpperCase(), password: hashedPassword, name, role: 'participant', needsPasswordSetup: false });
            return NextResponse.json({ participant: { userId: userId.toUpperCase(), name } }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT — update a participant
export async function PUT(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { userId, name } = body;

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const User = (await import('@/lib/models/User')).default;
            const existing = await User.findOne({ userId });
            if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 });
            if (name) existing.name = name;
            await existing.save();
            return NextResponse.json({ participant: { userId: existing.userId, name: existing.name } });
        } else {
            const { updateUser } = await import('@/lib/memoryStore');
            const updates = {};
            if (name) updates.name = name;
            const updated = updateUser(userId, updates);
            if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });
            return NextResponse.json({ participant: { userId: updated.userId, name: updated.name } });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE — remove a participant
export async function DELETE(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const User = (await import('@/lib/models/User')).default;
            await User.findOneAndDelete({ userId });
        } else {
            const { deleteUser } = await import('@/lib/memoryStore');
            deleteUser(userId);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
