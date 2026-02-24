import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function POST(request) {
    try {
        const { teamId, password } = await request.json();

        if (!teamId || !password) {
            return NextResponse.json({ error: 'Team ID and password are required' }, { status: 400 });
        }

        let team = null;
        const dbAvailable = await tryDb();

        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            team = await Team.findOne({ teamId: teamId.toUpperCase() });
        } else {
            const { findTeamByTeamId } = await import('@/lib/memoryStore');
            team = findTeamByTeamId(teamId.toUpperCase());
        }

        if (!team) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcryptjs.compare(password, team.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = await signToken({
            teamId: team.teamId,
            name: team.name,
            domain: team.domain,
            role: team.role,
        });

        const response = NextResponse.json({
            success: true,
            token,
            needsPasswordSetup: team.needsPasswordSetup || false,
            team: {
                teamId: team.teamId,
                name: team.name,
                domain: team.domain,
                role: team.role,
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
