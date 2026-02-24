import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

// GET — get current user's team
export async function GET(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            const team = await Team.findOne({
                $or: [{ leaderId: user.userId }, { 'members.userId': user.userId }]
            });
            return NextResponse.json({ team: team || null });
        } else {
            const { getTeamByMember } = await import('@/lib/memoryStore');
            return NextResponse.json({ team: getTeamByMember(user.userId) });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST — create a team (participant becomes leader)
export async function POST(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { teamName, members, domain } = body;

        if (!teamName || !domain) {
            return NextResponse.json({ error: 'Team name and domain are required' }, { status: 400 });
        }

        const dbAvailable = await tryDb();

        // Check if user already has a team
        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            const existing = await Team.findOne({
                $or: [{ leaderId: user.userId }, { 'members.userId': user.userId }]
            });
            if (existing) {
                return NextResponse.json({ error: 'You are already part of a team' }, { status: 400 });
            }
            const team = await Team.create({
                teamName,
                leaderId: user.userId,
                leaderName: user.name,
                members: members || [],
                domain,
            });
            return NextResponse.json({ team }, { status: 201 });
        } else {
            const { getTeamByMember, createTeam } = await import('@/lib/memoryStore');
            const existing = getTeamByMember(user.userId);
            if (existing) {
                return NextResponse.json({ error: 'You are already part of a team' }, { status: 400 });
            }
            const team = createTeam({
                teamName,
                leaderId: user.userId,
                leaderName: user.name,
                members: members || [],
                domain,
            });
            return NextResponse.json({ team }, { status: 201 });
        }
    } catch (error) {
        console.error('Team creation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT — update team (leader only)
export async function PUT(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { teamName, members, domain } = body;

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            const team = await Team.findOne({ leaderId: user.userId });
            if (!team) return NextResponse.json({ error: 'You are not a team leader' }, { status: 403 });
            if (teamName) team.teamName = teamName;
            if (members) team.members = members;
            if (domain) team.domain = domain;
            await team.save();
            return NextResponse.json({ team });
        } else {
            const { getTeamByLeader, updateTeamData } = await import('@/lib/memoryStore');
            const team = getTeamByLeader(user.userId);
            if (!team) return NextResponse.json({ error: 'You are not a team leader' }, { status: 403 });
            const updates = {};
            if (teamName) updates.teamName = teamName;
            if (members) updates.members = members;
            if (domain) updates.domain = domain;
            const updated = updateTeamData(team._id, updates);
            return NextResponse.json({ team: updated });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
