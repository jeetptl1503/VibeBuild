import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function GET(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (user.role === 'admin') {
            const dbAvailable = await tryDb();
            if (dbAvailable) {
                const Project = (await import('@/lib/models/Project')).default;
                const projects = await Project.find().sort({ createdAt: -1 });
                return NextResponse.json({ projects });
            } else {
                const { getProjects } = await import('@/lib/memoryStore');
                return NextResponse.json({ projects: getProjects() });
            }
        }

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Project = (await import('@/lib/models/Project')).default;
            const project = await Project.findOne({ userId: user.userId });
            return NextResponse.json({ project: project || null });
        } else {
            const { findProjectByUserId } = await import('@/lib/memoryStore');
            return NextResponse.json({ project: findProjectByUserId(user.userId) });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, description, githubUrl, liveUrl, techStack, status } = body;

        if (!title || !description || !githubUrl) {
            return NextResponse.json({ error: 'Title, description, and GitHub URL are required' }, { status: 400 });
        }

        const githubRegex = /^https?:\/\/(www\.)?github\.com\/.+\/.+/;
        if (!githubRegex.test(githubUrl)) {
            return NextResponse.json({ error: 'Invalid GitHub URL format' }, { status: 400 });
        }

        // Get user's team info if available
        let teamName = '';
        let domain = '';
        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            const team = await Team.findOne({
                $or: [{ leaderId: user.userId }, { 'members.userId': user.userId }]
            });
            if (team) { teamName = team.teamName; domain = team.domain; }
        } else {
            const { getTeamByMember } = await import('@/lib/memoryStore');
            const team = getTeamByMember(user.userId);
            if (team) { teamName = team.teamName; domain = team.domain; }
        }

        if (dbAvailable) {
            const Project = (await import('@/lib/models/Project')).default;
            const existing = await Project.findOne({ userId: user.userId });
            if (existing) {
                existing.title = title;
                existing.description = description;
                existing.githubUrl = githubUrl;
                existing.liveUrl = liveUrl || '';
                existing.techStack = techStack || [];
                existing.status = status || 'submitted';
                existing.teamName = teamName;
                existing.domain = domain;
                existing.updatedAt = new Date();
                if (status === 'submitted' && !existing.submittedAt) existing.submittedAt = new Date();
                await existing.save();
                return NextResponse.json({ project: existing, updated: true });
            }
            const project = await Project.create({
                userId: user.userId, userName: user.name, teamName, domain,
                title, description, githubUrl, liveUrl: liveUrl || '', techStack: techStack || [],
                status: status || 'submitted', submittedAt: status === 'submitted' ? new Date() : null,
            });
            return NextResponse.json({ project, created: true }, { status: 201 });
        } else {
            const { upsertProject } = await import('@/lib/memoryStore');
            const result = upsertProject(user.userId, {
                userId: user.userId, userName: user.name, teamName, domain,
                title, description, githubUrl, liveUrl: liveUrl || '', techStack: techStack || [],
                status: status || 'submitted', submittedAt: status === 'submitted' ? new Date().toISOString() : null,
            });
            return NextResponse.json(result, { status: result.created ? 201 : 200 });
        }
    } catch (error) {
        console.error('Project submission error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
