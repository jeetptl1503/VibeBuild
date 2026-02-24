import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export async function GET(request) {
    try {
        const user = await authenticateRequest(request);
        const isAdmin = user?.role === 'admin';

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Gallery = (await import('@/lib/models/Gallery')).default;
            const filter = isAdmin ? {} : { publicVisible: true };
            const items = await Gallery.find(filter).sort({ createdAt: -1 });
            return NextResponse.json({ items });
        } else {
            const { getGallery } = await import('@/lib/memoryStore');
            return NextResponse.json({ items: getGallery(!isAdmin) });
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
        const { filename, url, type, caption, publicVisible } = body;

        if (!filename || !url) {
            return NextResponse.json({ error: 'Filename and URL are required' }, { status: 400 });
        }

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Gallery = (await import('@/lib/models/Gallery')).default;
            const item = await Gallery.create({ filename, url, type: type || 'image', caption: caption || '', publicVisible: publicVisible !== false, uploadedBy: user.userId });
            return NextResponse.json({ item }, { status: 201 });
        } else {
            const { addGalleryItem } = await import('@/lib/memoryStore');
            const item = addGalleryItem({ filename, url, type: type || 'image', caption: caption || '', publicVisible: publicVisible !== false, uploadedBy: user.userId });
            return NextResponse.json({ item }, { status: 201 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        const { toggleGalleryVisibility } = await import('@/lib/memoryStore');
        const item = toggleGalleryVisibility(id);

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ item });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
