import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function POST(request, { params }) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { id } = await params;
        const { rating, score, adminFeedback } = await request.json();

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Project = (await import('@/lib/models/Project')).default;
            const project = await Project.findByIdAndUpdate(
                id,
                { rating, score, adminFeedback, updatedAt: Date.now() },
                { new: true }
            );
            if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            return NextResponse.json({ project });
        } else {
            const { updateProjectAdmin } = await import('@/lib/memoryStore');
            const project = updateProjectAdmin(id, { rating, score, adminFeedback });
            if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            return NextResponse.json({ project });
        }
    } catch (error) {
        console.error('Review Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
