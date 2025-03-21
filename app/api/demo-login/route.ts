// app/api/demo-login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { signIn } from "next-auth/react";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Set a cookie to indicate we're in demo mode
    cookies().set('demo_mode', 'true', {
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'lax'
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Demo mode activated" 
    });
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to activate demo mode" 
    }, { status: 500 });
  }
}