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
];

// この関数はミドルウェアとして実行される
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // パブリックパスの場合、認証チェックをスキップ
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
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
  
  // 未認証の場合はログインページにリダイレクト
  if (!token) {
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