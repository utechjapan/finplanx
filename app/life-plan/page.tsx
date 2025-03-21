// app/life-plan/page.tsx - Updated
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export default function LifePlanPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ライフプラン</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>ライフプランを作成</CardTitle>
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h2 className="text-xl font-medium mb-2">まだデータがありません</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              ライフプランを作成して、将来の財務目標を計画しましょう。
              結婚、住宅購入、子育てなどのライフイベントに向けた資金計画を立てることができます。
            </p>
            <Button>ライフプランを作成</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}