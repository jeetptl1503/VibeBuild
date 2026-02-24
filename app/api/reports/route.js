import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export async function GET(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Report = (await import('@/lib/models/Report')).default;
            const reports = await Report.find().sort({ createdAt: -1 });
            return NextResponse.json({ reports });
        } else {
            const { getReports } = await import('@/lib/memoryStore');
            return NextResponse.json({ reports: getReports() });
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
        const { fileName, fileUrl, fileType, category, description } = body;

        if (!fileName || !fileUrl) {
            return NextResponse.json({ error: 'File name and data are required' }, { status: 400 });
        }

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Report = (await import('@/lib/models/Report')).default;
            const report = await Report.create({
                fileName,
                fileUrl,
                fileType: fileType || 'Other',
                category: category || 'Other',
                description: description || '',
                uploadedBy: user.userId,
            });
            return NextResponse.json({ report }, { status: 201 });
        } else {
            const { addReport } = await import('@/lib/memoryStore');
            const report = addReport({
                fileName,
                fileUrl,
                fileType: fileType || 'Other',
                category: category || 'Other',
                description: description || '',
                uploadedBy: user.userId,
            });
            return NextResponse.json({ report }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
