// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactFormEmail } from "@/lib/email";
import { isDevMode } from "@/lib/auth";

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  subject: z.string().min(1, "件名は必須です"),
  message: z.string().min(1, "メッセージは必須です"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: result.error.format() },
        { status: 400 }
      );
    }
    
    // Log in dev mode
    if (isDevMode()) {
      console.log('Contact form submission in demo mode:', body);
    }
    
    // Send email
    await sendContactFormEmail(
      result.data.email,
      result.data.name,
      result.data.subject,
      result.data.message
    );
    
    // Return success response
    return NextResponse.json(
      { 
        message: "お問い合わせありがとうございます。担当者が確認次第、ご連絡いたします。" 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { error: "お問い合わせの送信中にエラーが発生しました。しばらくしてからもう一度お試しください。" },
      { status: 500 }
    );
  }
}