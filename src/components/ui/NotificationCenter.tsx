// src/components/ui/NotificationCenter.tsx
'use client';

import React, { Fragment, useState } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useNotifications } from '@/src/components/providers/NotificationProvider';
import { Button } from './Button';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, deleteNotification } = useNotifications();
  
  // Format the date for display
  const formatNotificationDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      if (hours < 1) {
        return '数分前';
      }
      return `${hours}時間前`;
    }
    
    // Less than a week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000));
      return `${days}日前`;
    }
    
    // Format as date
    return format(date, 'yyyy/MM/dd');
  };
  
  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };
  
  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };
  
  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    
    // Mark all as read when opening
    if (!isOpen && unreadCount > 0) {
      notifications.forEach(notification => {
        if (!notification.isRead) {
          markAsRead(notification.id);
        }
      });
    }
  };
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={toggleNotifications}
        aria-label="通知"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700 z-50"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium">通知</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X size={16} />
              </Button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto">
              {notifications.length > 0 ? (
                <div>
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 ${
                        notification.isRead ? '' : 'bg-blue-50 dark:bg-blue-900/20'
                      }`}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatNotificationDate(notification.createdAt)}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                      
                      {notification.targetDate && (
                        <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                          期限: {format(notification.targetDate, 'yyyy/MM/dd')}
                        </p>
                      )}
                      
                      <div className="mt-2 flex justify-end space-x-2">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Check size={14} className="mr-1" />
                            既読
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Trash2 size={14} className="mr-1" />
                          削除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell size={32} className="mx-auto mb-2 opacity-20" />
                  <p>新しい通知はありません</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};