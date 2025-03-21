// app/reports/page.tsx - Fixed version
'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/src/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Select } from '@/src/components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
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
  Cell,
  ComposedChart,
  Area,
  TooltipProps
} from 'recharts';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

// サンプルデータ
const monthlyData = [
  { month: '4月', income: 290000, expenses: 161000, savings: 129000 },
  { month: '5月', income: 290000, expenses: 215000, savings: 75000 },
  { month: '6月', income: 290000, expenses: 201000, savings: 89000 },
  { month: '7月', income: 290000, expenses: 161000, savings: 129000 },
  { month: '8月', income: 290000, expenses: 213800, savings: 76200 },
  { month: '9月', income: 290000, expenses: 241000, savings: 49000 },
  { month: '10月', income: 290000, expenses: 161000, savings: 129000 },
  { month: '11月', income: 290000, expenses: 161000, savings: 129000 },
  { month: '12月', income: 290000, expenses: 241000, savings: 49000 },
  { month: '1月', income: 290000, expenses: 181000, savings: 109000 },
  { month: '2月', income: 290000, expenses: 161000, savings: 129000 },
  { month: '3月', income: 290000, expenses: 161000, savings: 129000 },
];

const categoryExpenses = [
  { category: '住居費', amount: 960000, percentage: 39.9 },
  { category: '食費', amount: 600000, percentage: 24.9 },
  { category: '通信費', amount: 144000, percentage: 6.0 },
  { category: '光熱費', amount: 180000, percentage: 7.5 },
  { category: '交通費', amount: 216000, percentage: 9.0 },
  { category: '娯楽費', amount: 160000, percentage: 6.6 },
  { category: 'その他', amount: 144800, percentage: 6.0 },
];

const yearlyFinancials = [
  { year: '2025年', totalIncome: 3480000, totalExpenses: 2104800, totalSavings: 1375200, savingsRate: 39.5 },
  { year: '2026年', totalIncome: 4428000, totalExpenses: 2424800, totalSavings: 2003200, savingsRate: 45.2 },
  { year: '2027年', totalIncome: 5028000, totalExpenses: 2424800, totalSavings: 2603200, savingsRate: 51.8 },
  { year: '2028年', totalIncome: 5208000, totalExpenses: 2424800, totalSavings: 2783200, savingsRate: 53.4 },
  { year: '2029年', totalIncome: 5388000, totalExpenses: 2424800, totalSavings: 2963200, savingsRate: 55.0 },
];

const netWorthData = [
  { year: '2025年', assets: 1375200, liabilities: 1228505, netWorth: 146695 },
  { year: '2026年', assets: 3378400, liabilities: 1030425, netWorth: 2347975 },
  { year: '2027年', assets: 5981600, liabilities: 832345, netWorth: 5149255 },
  { year: '2028年', assets: 8764800, liabilities: 634265, netWorth: 8130535 },
  { year: '2029年', assets: 11728000, liabilities: 436185, netWorth: 11291815 },
  { year: '2030年', assets: 14691200, liabilities: 0, netWorth: 14691200 },
];

const categoryColors = {
  '住居費': '#8884d8',
  '食費': '#83a6ed',
  '通信費': '#8dd1e1',
  '光熱費': '#82ca9d',
  '交通費': '#a4de6c',
  '娯楽費': '#ffc658',
  'その他': '#ff8042'
};

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#ffc658', '#ff8042'];

export default function ReportsPage() {
  const [reportType, setReportType] = useState('monthly');
  const [reportPeriod, setReportPeriod] = useState('2025年');

  const handleExportPDF = () => {
    alert('PDFとしてエクスポート（実際の実装ではPDFをダウンロードします）');
  };

  const handleExportCSV = () => {
    alert('CSVとしてエクスポート（実際の実装ではCSVをダウンロードします）');
  };

  // Fixed formatter for tooltips to handle different types
  const formatTooltipValue = (value: ValueType, name: string) => {
    if (name === '貯蓄率') {
      return `${typeof value === 'number' ? value.toFixed(1) : value}%`;
    }
    return `¥${typeof value === 'number' ? value.toLocaleString() : value}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* ヘッダー部分 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold">レポート</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="report-type" className="text-sm whitespace-nowrap">レポートタイプ:</label>
              <Select
                id="report-type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="min-w-[150px]"
              >
                <option value="monthly">月間レポート</option>
                <option value="yearly">年間レポート</option>
                <option value="category">カテゴリ分析</option>
                <option value="networth">純資産推移</option>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="report-period" className="text-sm whitespace-nowrap">期間:</label>
              <Select
                id="report-period"
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="min-w-[150px]"
              >
                <option value="2025年">2025年</option>
                <option value="2026年">2026年</option>
                <option value="2027年">2027年</option>
                <option value="2028年">2028年</option>
                <option value="2029年">2029年</option>
                <option value="全期間">全期間</option>
              </Select>
            </div>
          </div>
        </div>

        {/* エクスポートボタン */}
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" onClick={handleExportPDF}>PDFとしてエクスポート</Button>
          <Button variant="outline" onClick={handleExportCSV}>CSVとしてエクスポート</Button>
        </div>

        {/* レポートタイプに応じた表示 */}
        {reportType === 'monthly' && (
          <Card>
            <CardHeader>
              <CardTitle>月間収支レポート ({reportPeriod})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 月別収支グラフ */}
                <div>
                  <h3 className="text-lg font-medium mb-4">月別収支グラフ</h3>
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
                </div>

                {/* 月間貯蓄率の推移 */}
                <div>
                  <h3 className="text-lg font-medium mb-4">月間貯蓄率の推移</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                        <Tooltip formatter={(value, name) => {
                          if (name === '貯蓄率') {
                            return [`${typeof value === 'number' ? value.toFixed(1) : value}%`, name];
                          }
                          return [`¥${typeof value === 'number' ? value.toLocaleString() : value}`, name];
                        }} />
                        <Legend />
                        {/* inline 関数で貯蓄率を計算 */}
                        <Line
                          type="monotone"
                          dataKey={(data) => (data.savings / data.income) * 100}
                          name="貯蓄率"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 月別詳細テーブル */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-4">月別詳細</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>月</TableHead>
                          <TableHead className="text-right">収入</TableHead>
                          <TableHead className="text-right">支出</TableHead>
                          <TableHead className="text-right">貯蓄</TableHead>
                          <TableHead className="text-right">貯蓄率</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {monthlyData.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell>{data.month}</TableCell>
                            <TableCell className="text-right">¥{data.income.toLocaleString()}</TableCell>
                            <TableCell className="text-right">¥{data.expenses.toLocaleString()}</TableCell>
                            <TableCell className="text-right">¥{data.savings.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              {((data.savings / data.income) * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* レポート要約 */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-4">レポート要約</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">年間総収入</div>
                        <div className="text-2xl font-bold">
                          ¥{monthlyData.reduce((sum, data) => sum + data.income, 0).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">年間総支出</div>
                        <div className="text-2xl font-bold">
                          ¥{monthlyData.reduce((sum, data) => sum + data.expenses, 0).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">年間総貯蓄</div>
                        <div className="text-2xl font-bold text-green-600">
                          ¥{monthlyData.reduce((sum, data) => sum + data.savings, 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-gray-500">年間平均貯蓄率</div>
                      <div className="text-2xl font-bold">
                        {(
                          (monthlyData.reduce((sum, data) => sum + data.savings, 0) /
                            monthlyData.reduce((sum, data) => sum + data.income, 0)) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Other report types continue as before... */}
        {/* The main fix is in the Tooltip formatter for handling the toFixed method */}
        
        {reportType === 'yearly' && (
          <Card>
            <CardHeader>
              <CardTitle>年間収支レポート</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 年間収支推移 */}
                <div>
                  <h3 className="text-lg font-medium mb-4">年間収支推移</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={yearlyFinancials}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis yAxisId="left" />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          domain={[0, 100]}
                          tickFormatter={(tick) => `${tick}%`}
                        />
                        <Tooltip formatter={(value, name) => {
                          if (name === '貯蓄率') {
                            return [`${typeof value === 'number' ? value.toFixed(1) : value}%`, name];
                          }
                          return [`¥${typeof value === 'number' ? value.toLocaleString() : value}`, name];
                        }} />
                        <Legend />
                        <Bar dataKey="totalIncome" name="総収入" yAxisId="left" fill="#8884d8" />
                        <Bar dataKey="totalExpenses" name="総支出" yAxisId="left" fill="#ff7f7f" />
                        <Bar dataKey="totalSavings" name="総貯蓄" yAxisId="left" fill="#82ca9d" />
                        <Line
                          type="monotone"
                          dataKey="savingsRate"
                          name="貯蓄率"
                          yAxisId="right"
                          stroke="#ff7300"
                          strokeWidth={2}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Rest of the yearly report content... */}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rest of the report types continue... */}
        
      </div>
    </DashboardLayout>
  );
}