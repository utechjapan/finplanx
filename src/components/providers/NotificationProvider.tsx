// src/components/providers/NotificationProvider.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  targetDate?: Date | null;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  createNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const fetchNotifications = async () => {
    if (status !== 'authenticated') return;
    
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      
      if (data.notifications) {
        // Convert date strings to Date objects
        const parsedNotifications = data.notifications.map((notification: any) => ({
          ...notification,
          targetDate: notification.targetDate ? new Date(notification.targetDate) : null,
          createdAt: new Date(notification.createdAt),
          updatedAt: new Date(notification.updatedAt)
        }));
        
        setNotifications(parsedNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };
  
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH'
      });
      
      if (response.ok) {
        setNotifications(notifications.map(notification => 
          notification.id === id ? { ...notification, isRead: true } : notification
        ));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setNotifications(notifications.filter(notification => notification.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };
  
  const createNotification = async (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      });
      
      const data = await response.json();
      
      if (response.ok && data.notification) {
        const newNotification = {
          ...data.notification,
          targetDate: data.notification.targetDate ? new Date(data.notification.targetDate) : null,
          createdAt: new Date(data.notification.createdAt),
          updatedAt: new Date(data.notification.updatedAt)
        };
        
        setNotifications([newNotification, ...notifications]);
      }
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };
  
  // Fetch notifications on component mount or session change
  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotifications();
    }
  }, [status]);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      fetchNotifications,
      markAsRead,
      deleteNotification,
      createNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};