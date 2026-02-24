import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function GET(request) {
    const user = await authenticateRequest(request);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check fresh DB state for needsPasswordSetup
    let needsPasswordSetup = false;
    try {
        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const User = (await import('@/lib/models/User')).default;
            const dbUser = await User.findOne({ userId: user.userId });
            if (dbUser) needsPasswordSetup = dbUser.needsPasswordSetup || false;
        } else {
            const { findUserByUserId } = await import('@/lib/memoryStore');
            const memUser = findUserByUserId(user.userId);
            if (memUser) needsPasswordSetup = memUser.needsPasswordSetup || false;
        }
    } catch (e) {
        // If DB check fails, just return JWT data
    }

    return NextResponse.json({
        user: {
            userId: user.userId,
            name: user.name,
            role: user.role,
            needsPasswordSetup,
        },
    });
}
