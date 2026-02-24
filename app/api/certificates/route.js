import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (user.role === 'admin') {
            const { getCertificates } = await import('@/lib/memoryStore');
            return NextResponse.json({ certificates: getCertificates() });
        } else {
            // Participants see only their own certificates
            const { getCertificateByStudentId } = await import('@/lib/memoryStore');
            return NextResponse.json({ certificates: getCertificateByStudentId(user.teamId) });
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
        const { studentName, studentId, certificateUrl, certificateType } = body;

        if (!studentName || !studentId) {
            return NextResponse.json({ error: 'Student name and ID are required' }, { status: 400 });
        }

        const { addCertificate } = await import('@/lib/memoryStore');
        const certificate = addCertificate({
            studentName,
            studentId: studentId.toUpperCase(),
            certificateUrl: certificateUrl || '',
            certificateType: certificateType || 'participation',
            issuedBy: user.teamId,
        });

        return NextResponse.json({ certificate }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
