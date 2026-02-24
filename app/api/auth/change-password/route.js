import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function POST(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { oldPassword, newPassword } = await request.json();

        if (!oldPassword || !newPassword) {
            return NextResponse.json({ error: 'Old password and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
        }

        // Fetch user with password to verify old password
        let dbUser = null;
        const dbAvailable = await tryDb();

        if (dbAvailable) {
            const User = (await import('@/lib/models/User')).default;
            dbUser = await User.findOne({ userId: user.userId });
        } else {
            const { findUserByUserId } = await import('@/lib/memoryStore');
            dbUser = findUserByUserId(user.userId);
        }

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify old password
        const isValid = await bcryptjs.compare(oldPassword, dbUser.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 403 });
        }

        // Hash and save new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        if (dbAvailable) {
            const User = (await import('@/lib/models/User')).default;
            await User.updateOne(
                { userId: user.userId },
                { password: hashedPassword, needsPasswordSetup: false }
            );
        } else {
            const { updateUser } = await import('@/lib/memoryStore');
            updateUser(user.userId, { password: hashedPassword, needsPasswordSetup: false });
        }

        return NextResponse.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
