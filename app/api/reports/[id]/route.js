import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

export async function DELETE(request, { params }) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { id } = await params;
        const { deleteReport } = await import('@/lib/memoryStore');
        deleteReport(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
