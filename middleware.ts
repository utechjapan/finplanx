// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-email-success',
  '/verify-email-error',
  '/api/auth',
  '/api/register',
  '/api/password-reset',
  '/api/contact',
  '/terms',
  '/privacy',
  '/contact',
  '/faq',
];

// This function is the middleware
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow static files and Next.js internals
  if (pathname.includes('.') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  // Check for demo mode cookie
  const hasDemoCookie = request.cookies.has('demo_mode');
  if (hasDemoCookie) {
    return NextResponse.next();
  }
  
  // Check for public paths
  for (const path of publicPaths) {
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      return NextResponse.next();
    }
  }
  
  // API routes can handle their own auth
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get JWT token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // If not authenticated, redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // Authenticated - allow access
  return NextResponse.next();
}

// Apply middleware to protected paths only
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
  ],
};