'use client';

import React from 'react';
import dynamic from 'next/dynamic';
// 相対パスを使用して明示的にインポート
import DashboardLayout from '../../src/components/layout/DashboardLayout';
import { Card, CardContent } from '../../src/components/ui/Card';

// 借金返済計画コンポーネントを動的にインポート
const DebtRepaymentPlan = dynamic(() => 
  import('../../src/components/finance/DebtRepaymentPlan'), { ssr: false }
);

export default function DebtRepaymentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">借金返済計画</h1>
        
        <Card>
          <CardContent className="p-0">
            <DebtRepaymentPlan />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}