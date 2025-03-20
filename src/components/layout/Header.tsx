// src/components/layout/Header.tsx
import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center bg-white px-4 shadow-sm dark:bg-gray-900">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold">FinPlanX</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            設定
          </Button>
          <Button variant="outline" size="sm">
            ログアウト
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;