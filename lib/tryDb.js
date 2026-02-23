import dbConnect from '@/lib/db';

let useMemory = false;

export async function tryDb() {
    if (useMemory) return false;
    try {
        await dbConnect();
        return true;
    } catch (e) {
        console.log('MongoDB unavailable, using in-memory store');
        useMemory = true;
        return false;
    }
}
