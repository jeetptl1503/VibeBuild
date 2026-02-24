import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function seedAdmins() {
    try {
        const User = (await import('@/lib/models/User')).default;
        const bcryptjs = (await import('bcryptjs')).default;

        const admins = [
            { userId: 'DMP001', name: 'Faculty Coordinator' },
            { userId: '25EC080', name: 'Student Coordinator 1' },
            { userId: '25EC112', name: 'Student Coordinator 2' },
        ];

        for (const admin of admins) {
            const existing = await User.findOne({ userId: admin.userId });
            if (!existing) {
                const tempPassword = await bcryptjs.hash('temppass2024', 10);
                await User.create({
                    userId: admin.userId,
                    name: admin.name,
                    password: tempPassword,
                    role: 'admin',
                    needsPasswordSetup: true,
                });
                console.log(`Seeded admin: ${admin.userId}`);
            }
        }
    } catch (e) {
        console.warn('Admin seeding skipped:', e.message);
    }
}

async function dbConnect() {
    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        }).then(async (mongoose) => {
            await seedAdmins();
            return mongoose;
        }).catch((e) => {
            // Clear the promise so the next call can retry
            cached.promise = null;
            throw e;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
