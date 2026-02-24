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
        if (dbAvailable) {
            const Attendance = (await import('@/lib/models/Attendance')).default;
            const records = await Attendance.find().sort({ createdAt: -1 });
            return NextResponse.json({ records });
        } else {
            const { getAttendance } = await import('@/lib/memoryStore');
            return NextResponse.json({ records: getAttendance() });
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
        const { participantName, studentId, firstHalf, secondHalf, remarks } = body;

        if (!participantName || !studentId) {
            return NextResponse.json({ error: 'Student name and ID are required' }, { status: 400 });
        }

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Attendance = (await import('@/lib/models/Attendance')).default;
            const record = await Attendance.create({
                participantName,
                studentId: studentId.toUpperCase(),
                firstHalf: firstHalf || false,
                secondHalf: secondHalf || false,
                remarks: remarks || '',
            });
            return NextResponse.json({ record }, { status: 201 });
        } else {
            const { addAttendance } = await import('@/lib/memoryStore');
            const record = addAttendance({
                participantName,
                studentId: studentId.toUpperCase(),
                firstHalf: firstHalf || false,
                secondHalf: secondHalf || false,
                remarks: remarks || '',
            });
            return NextResponse.json({ record }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
