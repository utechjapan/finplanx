// app/api/verify-email/[token]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyEmail } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    
    // Verify email
    const { success, message, error } = await verifyEmail(token);
    
    if (!success) {
      // Redirect to error page
      const url = new URL('/verify-email-error', req.url);
      url.searchParams.set('error', encodeURIComponent(error || 'メールアドレスの確認中にエラーが発生しました'));
      return NextResponse.redirect(url);
    }
    
    // Redirect to success page
    const url = new URL('/verify-email-success', req.url);
    url.searchParams.set('message', encodeURIComponent(message || 'メールアドレスが確認されました'));
    return NextResponse.redirect(url);
    
  } catch (error) {
    console.error("Email verification error:", error);
    
    // Redirect to error page
    const url = new URL('/verify-email-error', req.url);
    url.searchParams.set('error', encodeURIComponent('サーバーエラーが発生しました'));
    return NextResponse.redirect(url);
  }
}