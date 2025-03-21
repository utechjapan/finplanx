// app/reports/page.tsx - Updated
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">レポート</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>レポート生成</CardTitle>
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
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-xl font-medium mb-2">まだレポートがありません</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              財務データを入力すると、収支状況や資産推移などの詳細なレポートが生成されます。
              定期的なレポートを確認して、財務状況を把握しましょう。
            </p>
            <Button>データ入力へ</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}