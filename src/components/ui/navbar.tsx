// File: src/components/ui/navbar.tsx
// Enhanced navigation bar with notification dropdown

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  Bell, 
  Menu, 
  X, 
  Home,
  DollarSign,
  CreditCard,
  PieChart,
  Calendar,
  User,
  Settings,
  LogOut,
  Check,
  Trash2
} from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { useNotifications, Notification } from '@/src/components/providers/NotificationProvider';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface NavbarProps {
  brand?: string;
}

export default function Navbar({ brand = "FinPlanX" }: NavbarProps) {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Get notifications from context
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    deleteNotification, 
    clearAllNotifications, 
    markAllAsRead 
  } = useNotifications();

  // Handle notification dropdown clicks outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.type === 'expense_reminder') {
      // Navigate to finances page or specific expense detail
      window.location.href = '/finances';
    } else if (notification.type === 'debt_payment') {
      window.location.href = '/debt-repayment';
    } else if (notification.type === 'financial_goal') {
      window.location.href = '/goals';
    } else if (notification.type === 'investment_update') {
      window.location.href = '/investments';
    }
    
    // Close notification panel
    setIsNotificationsOpen(false);
  };

  // Format notification date for display
  const formatNotificationDate = (date: Date) => {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: ja
    });
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-blue-500 text-white w-8 h-8 rounded-md flex items-center justify-center font-bold text-xl">
                  F
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-white">{brand}</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {session && (
                <>
                  <Link
                    href="/dashboard"
                    className={clsx(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === '/dashboard'
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    )}
                  >
                    ダッシュボード
                  </Link>
                  <Link
                    href="/finances"
                    className={clsx(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === '/finances' || pathname.startsWith('/finances/')
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    )}
                  >
                    収支管理
                  </Link>
                  <Link
                    href="/debt-repayment"
                    className={clsx(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === '/debt-repayment' || pathname.startsWith('/debt-repayment/')
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    )}
                  >
                    借金返済
                  </Link>
                  <Link
                    href="/investments"
                    className={clsx(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname === '/investments' || pathname.startsWith('/investments/')
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    )}
                  >
                    投資管理
                  </Link>
                </>
              )}
            </div>
          </div>
          
          {/* Right side navigation items */}
          <div className="flex items-center">
            {/* Theme toggle button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {session ? (
              <>
                {/* Notifications dropdown */}
                <div className="ml-4 relative" ref={notificationRef}>
                  <button
                    type="button"
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications panel */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 max-h-[80vh] overflow-y-auto">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">通知</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => markAllAsRead()}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            すべて既読
                          </button>
                          <button
                            onClick={() => clearAllNotifications()}
                            className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            すべて削除
                          </button>
                        </div>
                      </div>
                      
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                          通知はありません
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id}
                              className={clsx(
                                "px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer",
                                !notification.isRead && "bg-blue-50 dark:bg-blue-900/30"
                              )}
                            >
                              <div className="flex justify-between">
                                <div className="flex-1" onClick={() => handleNotificationClick(notification)}>
                                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {notification.title}
                                  </h4>
                                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                    {notification.message}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {formatNotificationDate(notification.createdAt)}
                                  </p>
                                </div>
                                <div className="flex ml-2 space-x-1">
                                  {!notification.isRead && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                      title="既読にする"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                                    title="削除"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Profile dropdown */}
                <div className="ml-4 relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center max-w-xs rounded-full text-sm focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      {session.user?.name?.[0].toUpperCase() || session.user?.email?.[0].toUpperCase() || 'U'}
                    </div>
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.user?.name || 'ユーザー'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {session.user?.email || 'メールなし'}
                        </p>
                      </div>
                      <Link
                        href="/settings/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          プロフィール
                        </div>
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          設定
                        </div>
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          ログアウト
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {status === 'loading' ? (
                  <div className="ml-4 h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <div className="ml-4 flex items-center">
                    <Link
                      href="/login"
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      ログイン
                    </Link>
                    <Link
                      href="/register"
                      className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      登録
                    </Link>
                  </div>
                )}
              </>
            )}
            
            {/* Mobile menu button */}
            <div className="ml-4 flex sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={clsx(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    pathname === '/dashboard'
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  )}
                >
                  <div className="flex items-center">
                    <Home className="mr-2 h-5 w-5" />
                    ダッシュボード
                  </div>
                </Link>
                <Link
                  href="/finances"
                  className={clsx(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    pathname === '/finances' || pathname.startsWith('/finances/')
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  )}
                >
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    収支管理
                  </div>
                </Link>
                <Link
                  href="/debt-repayment"
                  className={clsx(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    pathname === '/debt-repayment' || pathname.startsWith('/debt-repayment/')
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  )}
                >
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    借金返済
                  </div>
                </Link>
                <Link
                  href="/investments"
                  className={clsx(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    pathname === '/investments' || pathname.startsWith('/investments/')
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  )}
                >
                  <div className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    投資管理
                  </div>
                </Link>
                <Link
                  href="/settings"
                  className={clsx(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    pathname === '/settings' || pathname.startsWith('/settings/')
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  )}
                >
                  <div className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    設定
                  </div>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-5 w-5" />
                    ログアウト
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-blue-500 hover:bg-blue-600 text-white"
                >
                  登録
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}