import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function GET(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { getReports } = await import('@/lib/memoryStore');
        return NextResponse.json({ reports: getReports() });
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
            return NextResponse.json({ error: 'File name and URL are required' }, { status: 400 });
        }

        const { addReport } = await import('@/lib/memoryStore');
        const report = addReport({
            fileName,
            fileUrl,
            fileType: fileType || 'other',
            category: category || 'Other',
            description: description || '',
            uploadedBy: user.teamId,
        });

        return NextResponse.json({ report }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
