'use client';

import React from 'react';
import DebtRepaymentPlan from '@/src/components/finance/DebtRepaymentPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';

export default function DebtRepaymentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">借金返済計画</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>借金総額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥1,228,505</div>
            <p className="text-sm text-gray-500 mt-2">残り返済期間: 5年</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>毎月の返済額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥22,451</div>
            <p className="text-sm text-gray-500 mt-2">平均金利: 3.0%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>完済予定日</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2030年6月</div>
            <p className="text-sm text-gray-500 mt-2">総支払額: ¥1,347,060</p>
          </CardContent>
        </Card>
      </div>
      
      <DebtRepaymentPlan />
    </div>
  );
}