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

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            await Team.updateOne(
                { teamId: user.teamId },
                { password: hashedPassword, needsPasswordSetup: false }
            );
        } else {
            const { updateTeam } = await import('@/lib/memoryStore');
            updateTeam(user.teamId, { password: hashedPassword, needsPasswordSetup: false });
        }

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Set password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
