// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 認証が必要ないパス
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
  '/icons', // For static assets
  '/avatars', // For static assets
];

// この関数はミドルウェアとして実行される
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Special case for static files
  if (pathname.includes('.') || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  // Dev/Demo mode - allow all access
  if (process.env.NODE_ENV !== 'production' || process.env.DEMO_MODE === '1') {
    return NextResponse.next();
  }
  
  // Always allow dashboard access if demo cookie exists
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

  // JWT トークンを取得
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Not authenticated - redirect to login
  if (!token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // Authenticated - allow access
  return NextResponse.next();
}

// Matcher - apply middleware only to these paths
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};