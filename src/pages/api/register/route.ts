// app/api/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// ユーザー登録スキーマ
const userSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(8, "パスワードは8文字以上である必要があります"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // バリデーション
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, password } = result.data;
    
    // 既存ユーザーのチェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 409 }
      );
    }
    
    // パスワードのハッシュ化
    const hashedPassword = await hash(password, 12);
    
    // ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    // 成功レスポンス
    return NextResponse.json(
      { 
        message: "ユーザーが正常に登録されました", 
        user: { 
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt 
        } 
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