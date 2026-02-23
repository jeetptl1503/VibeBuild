import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function PUT(request, { params }) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Attendance = (await import('@/lib/models/Attendance')).default;
            const record = await Attendance.findByIdAndUpdate(id, { ...body, updatedAt: new Date() }, { new: true });
            if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
            return NextResponse.json({ record });
        } else {
            const { updateAttendance } = await import('@/lib/memoryStore');
            const record = updateAttendance(id, body);
            if (!record) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
            return NextResponse.json({ record });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { id } = await params;

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Attendance = (await import('@/lib/models/Attendance')).default;
            await Attendance.findByIdAndDelete(id);
        } else {
            const { deleteAttendance } = await import('@/lib/memoryStore');
            deleteAttendance(id);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
