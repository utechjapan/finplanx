// app/api/notifications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isDevMode } from "@/lib/auth";

// Mark a notification as read
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }
    
    const notificationId = params.id;
    
    // In development/demo mode, just return success
    if (isDevMode()) {
      console.log('Demo mode: Marking notification as read:', notificationId);
      
      return NextResponse.json({
        success: true,
        message: "通知を既読にしました"
      });
    }
    
    // In production, update the database
    // First check if notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId
      }
    });
    
    if (!notification || notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: "通知が見つからないか、アクセス権限がありません" },
        { status: 404 }
      );
    }
    
    // Update notification
    await prisma.notification.update({
      where: {
        id: notificationId
      },
      data: {
        isRead: true
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "通知を既読にしました"
    });
    
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "通知の更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// Delete a notification
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }
    
    const notificationId = params.id;
    
    // In development/demo mode, just return success
    if (isDevMode()) {
      console.log('Demo mode: Deleting notification:', notificationId);
      
      return NextResponse.json({
        success: true,
        message: "通知を削除しました"
      });
    }
    
    // In production, delete from database
    // First check if notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: {
        id: notificationId
      }
    });
    
    if (!notification || notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: "通知が見つからないか、アクセス権限がありません" },
        { status: 404 }
      );
    }
    
    // Delete notification
    await prisma.notification.delete({
      where: {
        id: notificationId
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "通知を削除しました"
    });
    
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "通知の削除中にエラーが発生しました" },
      { status: 500 }
    );
  }
}