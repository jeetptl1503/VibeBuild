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

        const { newPassword } = await request.json();

        if (!newPassword || newPassword.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        const dbAvailable = await tryDb();
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

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Set password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
