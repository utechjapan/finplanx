// src/components/layout/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const Sidebar: React.FC = () => {
  const router = useRouter();
  
  const navItems: NavItem[] = [
    { label: 'ダッシュボード', href: '/dashboard', icon: 'home' },
    { label: '収支管理', href: '/finances', icon: 'dollar-sign' },
    { label: 'ライフプラン', href: '/life-plan', icon: 'calendar' },
    { label: '借金返済計画', href: '/debt-repayment', icon: 'credit-card' },
    { label: '資産形成', href: '/investments', icon: 'trending-up' },
    { label: 'レポート', href: '/reports', icon: 'bar-chart-2' },
  ];
  
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 overflow-y-auto dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center flex-shrink-0 px-4 mb-6">
          <span className="text-xl font-bold">FinPlanX</span>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = router.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                  }
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center">
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">ユーザー名</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">メールアドレス</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;