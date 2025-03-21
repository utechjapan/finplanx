// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { registerUser, isDevMode } from "@/lib/auth";

// User registration schema
const userSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上である必要があります"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Log registration attempt in dev/demo mode
    if (isDevMode()) {
      console.log('Registration attempt in demo mode:', body.email);
    }
    
    // Validation
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Register user with our helper function
    const { success, user, error } = await registerUser(
      result.data.name,
      result.data.email,
      result.data.password
    );
    
    if (!success) {
      return NextResponse.json(
        { error: error || "ユーザー登録中にエラーが発生しました" },
        { status: 409 }
      );
    }
    
    // Return success response
    return NextResponse.json(
      { 
        message: "ユーザーが正常に登録されました", 
        user,
        demoMode: isDevMode() 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("User registration error:", error);
    return NextResponse.json(
      { error: "ユーザー登録中にエラーが発生しました" },
      { status: 500 }
    );
  }
}