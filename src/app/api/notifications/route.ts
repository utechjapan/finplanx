// File: src/app/api/notifications/route.ts
// API routes for notification management

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for creating a notification
const createNotificationSchema = z.object({
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  type: z.string().min(1).max(50),
  targetDate: z.string().datetime().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  data: z.record(z.any()).optional(),
});

// GET handler - fetch notifications for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      // Return empty array in demo mode
      return NextResponse.json({
        notifications: [],
      });
    }
    
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler - create a new notification
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    // Validate input
    const validatedData = createNotificationSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error },
        { status: 400 }
      );
    }
    
    // Extract validated data
    const { title, message, type, targetDate, priority, data } = validatedData.data;
    
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      // Return a mock response in demo mode
      return NextResponse.json({
        notification: {
          id: `demo-${Date.now()}`,
          title,
          message,
          type,
          targetDate,
          isRead: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: session.user.id,
          priority: priority || 'medium',
          data: data || {},
        },
      });
    }
    
    // Create notification in database
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        targetDate: targetDate ? new Date(targetDate) : null,
        isRead: false,
        userId: session.user.id,
        priority: priority || 'medium',
        data: data || {},
      },
    });
    
    return NextResponse.json({
      notification,
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE handler - clear all notifications for the current user
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      // Return success in demo mode
      return NextResponse.json({
        success: true,
      });
    }
    
    await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
      },
    });
    
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error clearing notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}