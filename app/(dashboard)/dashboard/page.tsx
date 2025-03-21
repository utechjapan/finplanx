'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';

// サンプルデータ
const monthlyData = [
  { month: '1月', income: 300000, expenses: 220000, savings: 80000 },
  { month: '2月', income: 300000, expenses: 210000, savings: 90000 },
  { month: '3月', income: 300000, expenses: 230000, savings: 70000 },
  { month: '4月', income: 300000, expenses: 225000, savings: 75000 },
  { month: '5月', income: 320000, expenses: 235000, savings: 85000 },
  { month: '6月', income: 620000, expenses: 240000, savings: 380000 },
];

const savingsData = [
  { month: '1月', amount: 80000, total: 80000 },
  { month: '2月', amount: 90000, total: 170000 },
  { month: '3月', amount: 70000, total: 240000 },
  { month: '4月', amount: 75000, total: 315000 },
  { month: '5月', amount: 85000, total: 400000 },
  { month: '6月', amount: 380000, total: 780000 },
];

const expenseCategories = [
  { name: '住居費', value: 80000, color: '#8884d8' },
  { name: '食費', value: 50000, color: '#83a6ed' },
  { name: '通信費', value: 12000, color: '#8dd1e1' },
  { name: '光熱費', value: 15000, color: '#82ca9d' },
  { name: '交通費', value: 18000, color: '#a4de6c' },
  { name: 'その他', value: 45000, color: '#ffc658' }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>今月の収入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥320,000</div>
            <p className="text-sm text-gray-500 mt-2">前月比: +6.7%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今月の支出</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥235,000</div>
            <p className="text-sm text-gray-500 mt-2">前月比: +4.4%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今月の貯蓄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥85,000</div>
            <p className="text-sm text-gray-500 mt-2">前月比: +13.3%</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>収支推移</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="income" name="収入" fill="#8884d8" />
                  <Bar dataKey="expenses" name="支出" fill="#ff7f7f" />
                  <Bar dataKey="savings" name="貯蓄" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>貯蓄の累計推移</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={savingsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    name="累計貯蓄" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>支出カテゴリ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今後のライフイベント</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">夏季ボーナス</h3>
                  <p className="text-sm text-gray-500">2025年6月</p>
                </div>
                <span className="text-green-600 font-medium">+¥380,000</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">国内旅行</h3>
                  <p className="text-sm text-gray-500">2025年9月</p>
                </div>
                <span className="text-red-600 font-medium">-¥80,000</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">国内旅行</h3>
                  <p className="text-sm text-gray-500">2025年12月</p>
                </div>
                <span className="text-red-600 font-medium">-¥80,000</span>
              </li>
              <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">フィリピン旅行</h3>
                  <p className="text-sm text-gray-500">2027年1月</p>
                </div>
                <span className="text-red-600 font-medium">-¥200,000</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );