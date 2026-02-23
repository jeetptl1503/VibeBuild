import { NextResponse } from 'next/server';
import { tryDb } from '@/lib/tryDb';

export async function GET() {
    try {
        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Team = (await import('@/lib/models/Team')).default;
            const Project = (await import('@/lib/models/Project')).default;
            const Attendance = (await import('@/lib/models/Attendance')).default;
            const [totalTeams, totalProjects, attendance] = await Promise.all([
                Team.countDocuments({ role: 'team' }),
                Project.countDocuments({ status: 'submitted' }),
                Attendance.find(),
            ]);
            const domains = await Team.distinct('domain', { role: 'team' });
            const totalAttendance = attendance.length;
            const presentCount = attendance.filter(a => a.firstHalf || a.secondHalf).length;
            const attendancePercent = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;
            return NextResponse.json({ totalTeams, totalProjects, domainsActive: domains.length, attendancePercent });
        } else {
            const { getTeams, getProjects, getAttendance } = await import('@/lib/memoryStore');
            const teams = getTeams();
            const projects = getProjects({ status: 'submitted' });
            const attendance = getAttendance();
            const domains = [...new Set(teams.map(t => t.domain))];
            const totalAttendance = attendance.length;
            const presentCount = attendance.filter(a => a.firstHalf || a.secondHalf).length;
            return NextResponse.json({
                totalTeams: teams.length,
                totalProjects: projects.length,
                domainsActive: domains.length,
                attendancePercent: totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0,
            });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
