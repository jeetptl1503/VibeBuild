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

        const { userId, newPassword } = await request.json();

        if (!userId || !newPassword || newPassword.length < 8) {
            return NextResponse.json({ error: 'User ID and new password (min 8 chars) are required' }, { status: 400 });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const User = (await import('@/lib/models/User')).default;
            const user = await User.findOne({ userId: userId.toUpperCase() });
            if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
            user.password = hashedPassword;
            user.needsPasswordSetup = false;
            await user.save();
        } else {
            const { updateUser, findUserByUserId } = await import('@/lib/memoryStore');
            const user = findUserByUserId(userId.toUpperCase());
            if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
            updateUser(userId.toUpperCase(), { password: hashedPassword, needsPasswordSetup: false });
        }

        return NextResponse.json({ success: true, message: `Password reset for ${userId}` });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
