import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function DELETE(request, { params }) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const { id } = await params;

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Certificate = (await import('@/lib/models/Certificate')).default;
            await Certificate.findByIdAndDelete(id);
        } else {
            const { deleteCertificate } = await import('@/lib/memoryStore');
            deleteCertificate(id);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
