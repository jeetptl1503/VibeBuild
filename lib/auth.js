import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export async function signToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .setIssuedAt()
        .sign(secret);
}

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (e) {
        return null;
    }
}

export function getTokenFromRequest(request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
        const match = cookieHeader.match(/token=([^;]+)/);
        if (match) return match[1];
    }
    return null;
}

export async function authenticateRequest(request) {
    const token = getTokenFromRequest(request);
    if (!token) return null;
    return await verifyToken(token);
}

export async function requireAdmin(request) {
    const user = await authenticateRequest(request);
    if (!user || user.role !== 'admin') return null;
    return user;
}
