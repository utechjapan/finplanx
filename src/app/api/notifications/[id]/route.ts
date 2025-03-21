// File: src/app/api/notifications/[id]/route.ts
// API routes for individual notification actions

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET handler - fetch a specific notification
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      // Return a dummy response in demo mode
      return NextResponse.json({
        notification: {
          id,
          title: 'Demo Notification',
          message: 'This is a demo notification',
          type: 'system',
          isRead: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: session.user.id,
        },
      });
    }
    
    const notification = await prisma.notification.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      notification,
    });
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE handler - delete a specific notification
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      // Return success in demo mode
      return NextResponse.json({
        success: true,
      });
    }
    
    const notification = await prisma.notification.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });
    
    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    await prisma.notification.delete({
      where: {
        id,
      },
    });
    
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
