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
];

// この関数はミドルウェアとして実行される
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
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
  const token = await getToken({ req: request });
  
  // デモモードチェック - 開発環境またはDEMO_MODE=1の場合はアクセスを許可
  const isDemoMode = process.env.NODE_ENV === 'development' || process.env.DEMO_MODE === '1';
  
  // 未認証でデモモードでない場合はログインページにリダイレクト
  if (!token && !isDemoMode) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// マッチャー設定
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};