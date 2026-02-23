import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { tryDb } from '@/lib/tryDb';

export async function GET() {
    try {
        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Settings = (await import('@/lib/models/Settings')).default;
            let settings = await Settings.findOne({ key: 'main' });
            if (!settings) settings = await Settings.create({ key: 'main' });
            return NextResponse.json({ settings });
        } else {
            const { getSettings } = await import('@/lib/memoryStore');
            return NextResponse.json({ settings: getSettings() });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const user = await authenticateRequest(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const body = await request.json();

        const dbAvailable = await tryDb();
        if (dbAvailable) {
            const Settings = (await import('@/lib/models/Settings')).default;
            let settings = await Settings.findOne({ key: 'main' });
            if (!settings) settings = await Settings.create({ key: 'main' });
            if (body.submissionsEnabled !== undefined) settings.submissionsEnabled = body.submissionsEnabled;
            if (body.workshopEndTime) settings.workshopEndTime = new Date(body.workshopEndTime);
            if (body.announcement !== undefined) settings.announcement = body.announcement;
            if (body.galleryPublic !== undefined) settings.galleryPublic = body.galleryPublic;
            settings.updatedAt = new Date();
            await settings.save();
            return NextResponse.json({ settings });
        } else {
            const { updateSettings } = await import('@/lib/memoryStore');
            const settings = updateSettings(body);
            return NextResponse.json({ settings });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
