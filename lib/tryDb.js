import dbConnect from '@/lib/db';

export async function tryDb() {
    try {
        await dbConnect();
        return true;
    } catch (e) {
        console.log('MongoDB unavailable, using in-memory store:', e.message);
        return false;
    }
}
