// app/api/notifications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isDevMode } from "@/lib/auth";

// Get all notifications for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }
    
    // In development/demo mode, return mock notifications
    if (isDevMode()) {
      return NextResponse.json({
        notifications: [
          {
            id: "1",
            title: "家賃の支払い期限",
            message: "25日までに家賃の支払いを忘れないでください",
            type: "expense_reminder",
            targetDate: new Date(new Date().setDate(25)),
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: "2",
            title: "水道光熱費の支払い",
            message: "今月の水道光熱費の支払い期限は28日です",
            type: "expense_reminder",
            targetDate: new Date(new Date().setDate(28)),
            isRead: true,
            createdAt: new Date(Date.now() - 86400000),
            updatedAt: new Date(Date.now() - 86400000)
          }
        ]
      });
    }
    
    // In production mode, get notifications from database
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ notifications });
    
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "通知の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// Create a new notification
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    // Validate input
    if (!body.title || !body.message || !body.type) {
      return NextResponse.json(
        { error: "必須フィールドがありません" },
        { status: 400 }
      );
    }
    
    // In development/demo mode, just return success without creating
    if (isDevMode()) {
      console.log('Demo mode: Simulating notification creation:', body);
      
      return NextResponse.json({
        notification: {
          id: "demo-" + Date.now(),
          userId: session.user.id,
          title: body.title,
          message: body.message,
          type: body.type,
          targetDate: body.targetDate || null,
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
    
    // In production mode, create in database
    const notification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: body.title,
        message: body.message,
        type: body.type,
        targetDate: body.targetDate || null,
        isRead: false
      }
    });
    
    return NextResponse.json({
      notification
    });
    
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "通知の作成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}