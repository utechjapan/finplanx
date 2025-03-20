'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/src/components/layout/DashboardLayout';
import { Button } from '@/src/components/ui/Button';
import { Card, CardContent } from '@/src/components/ui/Card';
import dynamic from 'next/dynamic';

// 収支計画コンポーネントを動的にインポート
const FinancialForecastCompact = dynamic(() => 
  import('@/src/components/finance/FinancialForecastCompact'), { ssr: false }
);

const MonthlyCashFlow = dynamic(() => 
  import('@/src/components/finance/MonthlyCashFlow'), { ssr: false }
);

export default function FinancesPage() {
  const [activeView, setActiveView] = useState<'summary' | 'monthly'>('summary');
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">収支計画</h1>
          <div className="flex space-x-2">
            <Button
              variant={activeView === 'summary' ? 'default' : 'outline'}
              onClick={() => setActiveView('summary')}
            >
              サマリー
            </Button>
            <Button
              variant={activeView === 'monthly' ? 'default' : 'outline'}
              onClick={() => setActiveView('monthly')}
            >
              月次詳細
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-0">
            {activeView === 'summary' ? (
              <FinancialForecastCompact />
            ) : (
              <MonthlyCashFlow />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}