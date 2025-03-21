// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicPaths = [
  '/',
  '/login',
  '/register',
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
  
  // Check if path is public
  for (const path of publicPaths) {
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      return NextResponse.next();
    }
  }
  
  // Skip auth for API routes except for protected ones
  if (pathname.startsWith('/api/') && 
      !pathname.startsWith('/api/notifications') &&
      !pathname.startsWith('/api/user')) {
    return NextResponse.next();
  }
  
  // Skip auth for static files
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // Get JWT token from request
  const token = await getToken({ req: request });
  
  // Redirect to login if not authenticated
  if (!token) {
    console.log('[Middleware] No token found, redirecting to login');
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // User is authenticated, allow access
  console.log('[Middleware] User is authenticated, allowing access');
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
    '/settings/:path*',
    '/api/notifications/:path*',
    '/api/user/:path*'
  ],
};