import { NextResponse } from 'next/server';
import { tryDb } from '@/lib/tryDb';

export async function GET() {
    try {
        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Project = (await import('@/lib/models/Project')).default;
            const projects = await Project.find({ status: 'submitted' }).select('-__v').sort({ submittedAt: -1 });
            return NextResponse.json({ projects });
        } else {
            const { getProjects } = await import('@/lib/memoryStore');
            return NextResponse.json({ projects: getProjects({ status: 'submitted' }) });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
