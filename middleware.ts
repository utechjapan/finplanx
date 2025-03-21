// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/demo',
  '/api/auth',
  '/api/register',
  '/terms',
  '/privacy',
  '/contact',
  '/faq',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-email-success',
  '/verify-email-error',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Demo mode - always allow all access in development or if demo mode is enabled
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.NODE_ENV !== 'production') {
    console.log(`[Middleware] Development/Demo mode: allowing access to ${pathname}`);
    return NextResponse.next();
  }
  
  // Check if path is public
  for (const path of publicPaths) {
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      return NextResponse.next();
    }
  }
  
  // Always allow access to API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Skip auth for static files
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check for session cookie
  const hasSessionToken = request.cookies.has('next-auth.session-token') || 
                          request.cookies.has('__Secure-next-auth.session-token');
  
  // Redirect to login if no session token
  if (!hasSessionToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // User has session token, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/finances/:path*',
    '/life-plan/:path*',
    '/debt-repayment/:path*',
    '/investments/:path*',
    '/reports/:path*',
    '/profile/:path*',
    '/settings/:path*'
  ],
};