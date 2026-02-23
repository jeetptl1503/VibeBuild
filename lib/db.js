import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null, failed: false };
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
        }).then((mongoose) => {
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
