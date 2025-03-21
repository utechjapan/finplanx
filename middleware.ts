// middleware.ts - Improved version
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
];

// この関数はミドルウェアとして実行される
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Always allow dashboard access in development
  if (process.env.NODE_ENV !== 'production' || process.env.DEMO_MODE === '1') {
    console.log('[Middleware] Development/Demo mode: allowing all access');
    return NextResponse.next();
  }
  
  // Always allow dashboard access if demo cookie exists
  const hasDemoCookie = request.cookies.has('demo_mode');
  if (hasDemoCookie) {
    console.log('[Middleware] Demo cookie detected: allowing access');
    return NextResponse.next();
  }
  
  // パブリックパスの場合、認証チェックをスキップ
  for (const path of publicPaths) {
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      return NextResponse.next();
    }
  }
  
  // API エンドポイントの場合、認証チェックをスキップ
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // 静的ファイルの場合、認証チェックをスキップ
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // JWT トークンを取得
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // 未認証の場合はログインページにリダイレクト
  if (!token) {
    console.log('[Middleware] No token found, redirecting to login');
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // If we reach here, the user is authenticated
  console.log('[Middleware] User is authenticated, allowing access');
  return NextResponse.next();
}

// マッチャー設定 - simplified to capture main protected paths
export const config = {
  matcher: [
    // Only apply middleware to these paths
    '/dashboard/:path*',
    '/finances/:path*',
    '/life-plan/:path*',
    '/debt-repayment/:path*',
    '/investments/:path*',
    '/reports/:path*'
  ],
};