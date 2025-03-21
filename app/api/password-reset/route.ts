// app/api/password-reset/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generatePasswordResetToken } from "@/lib/auth";

// Validation schema for password reset request
const resetRequestSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const result = resetRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Generate and send password reset token
    const { success, message, error } = await generatePasswordResetToken(result.data.email);
    
    if (!success) {
      return NextResponse.json(
        { error: error || "パスワードリセットリンクの送信中にエラーが発生しました" },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json(
      { message: message || "パスワードリセットリンクを送信しました" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}