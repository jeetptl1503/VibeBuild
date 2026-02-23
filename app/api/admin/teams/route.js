import { NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function GET(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            const teams = await Team.find({ role: 'team' }).select('-password').sort({ teamId: 1 });
            return NextResponse.json({ teams });
        } else {
            const { getTeams } = await import('@/lib/memoryStore');
            return NextResponse.json({ teams: getTeams() });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { teamId, password, name, domain, members } = body;

        if (!teamId || !password || !name || !domain) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            const existing = await Team.findOne({ teamId: teamId.toUpperCase() });
            if (existing) return NextResponse.json({ error: 'Team ID already exists' }, { status: 400 });
            const hashedPassword = await bcryptjs.hash(password, 10);
            const team = await Team.create({ teamId: teamId.toUpperCase(), password: hashedPassword, name, domain, role: 'team', members: members || [] });
            return NextResponse.json({ team: { teamId: team.teamId, name: team.name, domain: team.domain } }, { status: 201 });
        } else {
            const { findTeamByTeamId, addTeam } = await import('@/lib/memoryStore');
            if (findTeamByTeamId(teamId.toUpperCase())) return NextResponse.json({ error: 'Team ID already exists' }, { status: 400 });
            const hashedPassword = await bcryptjs.hash(password, 10);
            addTeam({ teamId: teamId.toUpperCase(), password: hashedPassword, name, domain, role: 'team', members: members || [] });
            return NextResponse.json({ team: { teamId: teamId.toUpperCase(), name, domain } }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { teamId, name, domain, members } = body;

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            const team = await Team.findOne({ teamId });
            if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
            if (name) team.name = name;
            if (domain) team.domain = domain;
            if (members) team.members = members;
            await team.save();
            return NextResponse.json({ team: { teamId: team.teamId, name: team.name, domain: team.domain } });
        } else {
            const { updateTeam } = await import('@/lib/memoryStore');
            const updates = {};
            if (name) updates.name = name;
            if (domain) updates.domain = domain;
            if (members) updates.members = members;
            const team = updateTeam(teamId, updates);
            if (!team) return NextResponse.json({ error: 'Team not found' }, { status: 404 });
            return NextResponse.json({ team: { teamId: team.teamId, name: team.name, domain: team.domain } });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const teamId = searchParams.get('teamId');
        if (!teamId) return NextResponse.json({ error: 'Team ID is required' }, { status: 400 });

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            await Team.findOneAndDelete({ teamId });
        } else {
            const { deleteTeam } = await import('@/lib/memoryStore');
            deleteTeam(teamId);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
