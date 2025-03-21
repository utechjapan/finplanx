// app/investments/page.tsx - Updated
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export default function InvestmentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">資産形成</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>資産形成を開始</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <h2 className="text-xl font-medium mb-2">まだデータがありません</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              資産形成プランを作成して、将来の資産を築きましょう。
              投資ポートフォリオの設定、リスク許容度の確認、長期的な資産成長の予測ができます。
            </p>
            <Button>資産形成を開始</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}