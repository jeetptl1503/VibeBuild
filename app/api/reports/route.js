import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function GET(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const dbAvailable = await tryDb();
        let teams, projects, attendance;

        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            const Project = (await import('@/lib/models/Project')).default;
            const Attendance = (await import('@/lib/models/Attendance')).default;
            [teams, projects, attendance] = await Promise.all([
                Team.find({ role: 'team' }).select('-password'),
                Project.find(),
                Attendance.find(),
            ]);
        } else {
            const mem = await import('@/lib/memoryStore');
            teams = mem.getTeams();
            projects = mem.getProjects();
            attendance = mem.getAttendance();
        }

        const domainDistribution = {};
        teams.forEach(t => {
            domainDistribution[t.domain] = (domainDistribution[t.domain] || 0) + 1;
        });

        const submittedProjects = projects.filter(p => p.status === 'submitted');
        const submissionRate = teams.length > 0 ? Math.round((submittedProjects.length / teams.length) * 100) : 0;
        const firstHalfPresent = attendance.filter(a => a.firstHalf).length;
        const secondHalfPresent = attendance.filter(a => a.secondHalf).length;

        return NextResponse.json({
            teams,
            projects,
            attendance,
            analytics: {
                totalTeams: teams.length,
                totalSubmissions: submittedProjects.length,
                drafts: projects.filter(p => p.status === 'draft').length,
                submissionRate,
                domainDistribution,
                attendanceStats: { total: attendance.length, firstHalfPresent, secondHalfPresent },
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
