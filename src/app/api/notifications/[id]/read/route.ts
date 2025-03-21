// File: src/app/api/notifications/[id]/read/route.ts
// API route for marking a notification as read

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT handler - mark a notification as read
export async function PUT(
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
    
    await prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
      },
    });
    
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
