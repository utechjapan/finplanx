// middleware.ts - Improved middleware with better routing rules

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
  '/api/password-reset',
  '/api/verify-email',
  '/api/contact',
  '/api/demo-login',
];

// Static file extensions to ignore
const staticFileExtensions = [
  '.jpg', '.jpeg', '.png', '.gif', '.ico', '.svg',
  '.css', '.js', '.woff', '.woff2', '.ttf', '.eot'
];

// Check if a path is for a static file
const isStaticFile = (path: string): boolean => {
  return staticFileExtensions.some(ext => path.endsWith(ext));
};

// Check if a path is in the public paths list or starts with any of them
const isPublicPath = (path: string): boolean => {
  return publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files
  if (isStaticFile(pathname)) {
    return NextResponse.next();
  }
  
  // Allow access to public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // Allow public API routes
  if (pathname.startsWith('/api/') && 
      !pathname.startsWith('/api/notifications') && 
      !pathname.startsWith('/api/user')) {
    return NextResponse.next();
  }
  
  // Get authentication token
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    // If not authenticated, redirect to login
    if (!token) {
      console.log(`[Middleware] No token found, redirecting to login from ${pathname}`);
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }
    
    // If trying to access homepage, redirect to dashboard for authenticated users
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // User is authenticated, allow access
    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] Error checking authentication:', error);
    // On error, redirect to login as a fallback
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
}

// Configure paths that require middleware
export const config = {
  matcher: [
    // Match all protected routes
    '/dashboard/:path*',
    '/finances/:path*',
    '/life-plan/:path*',
    '/debt-repayment/:path*',
    '/investments/:path*',
    '/reports/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/api/notifications/:path*',
    '/api/user/:path*',
    // Also match root to handle redirection to dashboard for authenticated users
    '/'
  ],
};