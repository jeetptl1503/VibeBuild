import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null, failed: false };
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
    if (cached.failed) {
        throw new Error('MongoDB connection previously failed');
    }

    if (!MONGODB_URI) {
        cached.failed = true;
        throw new Error('Please define the MONGODB_URI environment variable');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
        }).then(async (mongoose) => {
            // Auto-seed admin accounts on first connection
            await seedAdmins();
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        cached.failed = true;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
