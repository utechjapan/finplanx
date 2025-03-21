'use client';

import React from 'react';
import FinancialForecastCompact from '@/src/components/finance/FinancialForecastCompact';
import MonthlyCashFlow from '@/src/components/finance/MonthlyCashFlow';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/Tabs';

export default function LifePlanPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ライフプラン</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">5年後の純資産</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥10.67M</div>
            <p className="text-sm text-gray-500 mt-2">現在の5倍以上</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">平均月間貯蓄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥178K</div>
            <p className="text-sm text-gray-500 mt-2">収入の約45%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">予定ライフイベント</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7件</div>
            <p className="text-sm text-gray-500 mt-2">直近: フィリピン旅行</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">借金完済予定</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2030年</div>
            <p className="text-sm text-gray-500 mt-2">残り5年</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="monthly">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="monthly" className="flex-1">月次収支</TabsTrigger>
          <TabsTrigger value="forecast" className="flex-1">中長期予測</TabsTrigger>
          <TabsTrigger value="events" className="flex-1">ライフイベント</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="mt-6">
          <MonthlyCashFlow />
        </TabsContent>
        
        <TabsContent value="forecast" className="mt-6">
          <FinancialForecastCompact />
        </TabsContent>
        
        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>今後のライフイベント</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative pl-8 pb-8 border-l-2 border-blue-200">
                  <div className="absolute left-0 top-0 bg-blue-500 rounded-full w-4 h-4 -ml-2"></div>
                  <div className="mb-1 flex justify-between">
                    <h3 className="text-lg font-semibold">ジム年会費</h3>
                    <span className="text-gray-500">2025年8月</span>
                  </div>
                  <p className="text-gray-600">年額: ¥52,800</p>
                </div>
                
                <div className="relative pl-8 pb-8 border-l-2 border-blue-200">
                  <div className="absolute left-0 top-0 bg-blue-500 rounded-full w-4 h-4 -ml-2"></div>
                  <div className="mb-1 flex justify-between">
                    <h3 className="text-lg font-semibold">国内旅行</h3>
                    <span className="text-gray-500">2025年9月</span>
                  </div>
                  <p className="text-gray-600">予算: ¥80,000 x 3回/年 (5月、9月、12月)</p>
                </div>
                
                <div className="relative pl-8 pb-8 border-l-2 border-blue-200">
                  <div className="absolute left-0 top-0 bg-blue-500 rounded-full w-4 h-4 -ml-2"></div>
                  <div className="mb-1 flex justify-between">
                    <h3 className="text-lg font-semibold">国内旅行</h3>
                    <span className="text-gray-500">2025年12月</span>
                  </div>
                  <p className="text-gray-600">予算: ¥80,000</p>
                </div>
                
                <div className="relative pl-8 pb-8 border-l-2 border-blue-200">
                  <div className="absolute left-0 top-0 bg-pink-500 rounded-full w-4 h-4 -ml-2"></div>
                  <div className="mb-1 flex justify-between">
                    <h3 className="text-lg font-semibold">フィリピン旅行</h3>
                    <span className="text-gray-500">2027年1月</span>
                  </div>
                  <p className="text-gray-600">予算: ¥200,000</p>
                  <p className="text-sm text-gray-500 mt-1">初めての海外旅行</p>
                </div>
                
                <div className="relative pl-8 pb-8 border-l-2 border-blue-200">
                  <div className="absolute left-0 top-0 bg-green-500 rounded-full w-4 h-4 -ml-2"></div>
                  <div className="mb-1 flex justify-between">
                    <h3 className="text-lg font-semibold">資格取得</h3>
                    <span className="text-gray-500">2028年4月</span>
                  </div>
                  <p className="text-gray-600">予算: ¥120,000</p>
                  <p className="text-sm text-gray-500 mt-1">IT関連資格</p>
                </div>
                
                <div className="relative pl-8 pb-8 border-l-2 border-blue-200">
                  <div className="absolute left-0 top-0 bg-purple-500 rounded-full w-4 h-4 -ml-2"></div>
                  <div className="mb-1 flex justify-between">
                    <h3 className="text-lg font-semibold">車の購入</h3>
                    <span className="text-gray-500">2029年10月</span>
                  </div>
                  <p className="text-gray-600">予算: ¥2,500,000</p>
                  <p className="text-sm text-gray-500 mt-1">現金一括払い</p>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 bg-red-500 rounded-full w-4 h-4 -ml-2"></div>
                  <div className="mb-1 flex justify-between">
                    <h3 className="text-lg font-semibold">借金完済</h3>
                    <span className="text-gray-500">2030年6月</span>
                  </div>
                  <p className="text-green-600 font-medium">総支払額: ¥1,347,060</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}