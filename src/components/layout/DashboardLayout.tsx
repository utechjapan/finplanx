// src/components/layout/DashboardLayout.tsx
'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard,
  CreditCard,
  PieChart,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  User,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';

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
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // 現在のユーザー情報（実際の実装ではAPIやContextから取得）
  const currentUser = {
    name: '山田 太郎',
    email: 'user@example.com',
    avatar: '/avatars/avatar-1.jpg',
  };

  // 仮のお知らせデータ
  const notifications = [
    { id: 1, title: '家賃の支払い期限が近づいています', date: '1時間前', read: false },
    { id: 2, title: '今月の予算を15%達成しました', date: '昨日', read: false },
    { id: 3, title: '資産配分のリバランスをおすすめします', date: '3日前', read: true },
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* モバイルサイドバートグル */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          aria-label="メニュー"
          className="bg-white shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* サイドバー - モバイル */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setSidebarOpen(false)}></div>
            
            <motion.nav
              className="relative flex flex-col w-72 max-w-xs bg-white h-full"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex items-center px-4 mb-6">
                  <Link href="/dashboard" className="flex items-center space-x-2">
                    <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-white">F</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">FinPlanX</span>
                  </Link>
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
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
              
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    className="h-10 w-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* サイドバー - デスクトップ */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex items-center px-4 mb-6">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-white">F</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">FinPlanX</span>
                </Link>
              </div>
              
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
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                </div>
                <Link href="/logout">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <LogOut size={18} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* ヘッダー */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {navItems.find(item => item.href === pathname)?.label || 'ダッシュボード'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {/* お知らせボタン */}
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
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  )}
                </Button>
                
                {/* お知らせドロップダウン */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="py-2 px-3 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900">お知らせ</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                            >
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">
                            お知らせはありません
                          </div>
                        )}
                      </div>
                      <div className="py-2 px-3 border-t border-gray-100 text-center">
                        <Link href="/notifications" className="text-xs text-blue-600 hover:text-blue-500">
                          すべて見る
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* ユーザーメニュー */}
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
                
                {/* ユーザードロップダウン */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="py-1">
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          プロフィール
                        </Link>
                        <Link 
                          href="/settings" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          設定
                        </Link>
                        <Link 
                          href="/help" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          ヘルプ
                        </Link>
                        <div className="border-t border-gray-100"></div>
                        <Link 
                          href="/logout" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          ログアウト
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        
        {/* メインコンテンツ */}
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