'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/finances', label: '収支管理', icon: DollarSign },
  { href: '/life-plan', label: 'ライフプラン', icon: Calendar },
  { href: '/debt-repayment', label: '借金返済計画', icon: CreditCard },
  { href: '/investments', label: '資産形成', icon: TrendingUp },
  { href: '/reports', label: 'レポート', icon: BarChart2 },
  { href: '/profile', label: 'プロフィール', icon: User },
  { href: '/settings', label: '設定', icon: Settings },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render the dashboard yet
  if (status === 'unauthenticated') {
    return null;
  }

  // Current user information from session
  const currentUser = {
    name: session?.user?.name || 'ユーザー',
    email: session?.user?.email || 'user@example.com',
  };

  // Sample notifications
  const notifications = [
    { id: 1, title: '家賃の支払い期限が近づいています', date: '1時間前', read: false },
    { id: 2, title: '今月の予算を15%達成しました', date: '昨日', read: false },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          aria-label="メニュー"
          className="bg-white dark:bg-gray-800 shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-gray-600 dark:bg-gray-900 opacity-75"
              onClick={() => setSidebarOpen(false)}
            ></div>
            <motion.nav
              className="relative flex flex-col w-72 max-w-xs bg-white dark:bg-gray-800 h-full"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex items-center justify-between px-4 mb-6">
                  <Link href="/dashboard" className="flex items-center space-x-2">
                    <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-white">F</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">FinPlanX</span>
                  </Link>
                  <ThemeToggle />
                </div>
                <div className="flex-1 px-2 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon
                          className={`mr-3 h-5 w-5 ${
                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                          }`}
                        />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between px-4 pt-5 pb-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">F</span>
                </div>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">FinPlanX</span>
              </Link>
              <ThemeToggle />
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
              <nav className="flex-1 px-2 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <Icon
                        className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                        }`}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {currentUser.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {navItems.find((item) => item.href === pathname)?.label || 'ダッシュボード'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {/* Notifications button */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setUserMenuOpen(false);
                  }}
                >
                  <Bell size={20} />
                  {notifications.some((n) => !n.read) && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Button>
                {/* Notifications dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="py-2 px-3 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">お知らせ</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                !notification.read ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                              }`}
                            >
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notification.date}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                            お知らせはありません
                          </div>
                        )}
                      </div>
                      <div className="py-2 px-3 border-t border-gray-100 dark:border-gray-700 text-center">
                        <Link
                          href="#"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                        >
                          すべて見る
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* User menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotificationsOpen(false);
                  }}
                >
                  <span className="sr-only">ユーザーメニューを開く</span>
                  <User size={20} />
                  <span className="hidden md:inline-block">{currentUser.name}</span>
                </Button>
                {/* User dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          プロフィール
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          設定
                        </Link>
                        <div className="border-t border-gray-100 dark:border-gray-700"></div>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                        >
                          ログアウト
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
