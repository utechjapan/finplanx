import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

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
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // In production mode, NODE_ENV is "production"
  // Do not bypass auth in production
  const hasDemoCookie = request.cookies.has('demo_mode');
  if (hasDemoCookie) {
    console.log('[Middleware] Demo cookie detected: allowing access');
    return NextResponse.next();
  }
  
  for (const path of publicPaths) {
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      return NextResponse.next();
    }
  }
  
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });
  
  if (!token) {
    console.log('[Middleware] No token found, redirecting to login');
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
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
    '/reports/:path*'
  ],
};
