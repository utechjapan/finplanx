// app/api/password-reset/[token]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resetPassword } from "@/lib/auth";

// Validation schema for password reset
const resetSchema = z.object({
  password: z.string().min(8, "パスワードは8文字以上である必要があります"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    const body = await req.json();
    
    // Validate input
    const result = resetSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Reset password
    const { success, message, error } = await resetPassword(token, result.data.password);
    
    if (!success) {
      return NextResponse.json(
        { error: error || "パスワードのリセット中にエラーが発生しました" },
        { status: 400 }
      );
    }
    
    // Return success response
    return NextResponse.json(
      { message: message || "パスワードがリセットされました" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}