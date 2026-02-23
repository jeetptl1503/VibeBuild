import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Public routes that don't need auth
    const publicRoutes = ['/', '/login', '/showcase', '/schedule', '/faq'];
    const publicApiRoutes = ['/api/auth/login', '/api/projects/public', '/api/stats', '/api/admin/settings'];

    if (publicRoutes.includes(pathname) || publicApiRoutes.some(r => pathname.startsWith(r))) {
        return NextResponse.next();
    }

    // Static files and API routes except protected ones
    if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.includes('.')) {
        return NextResponse.next();
    }

    // For API routes, let the route handlers manage auth
    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Check for token in cookies for page routes
    const token = request.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
