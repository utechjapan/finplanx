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
  Area
} from 'recharts';

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
                            return [`${value.toFixed(1)}%`, name];
                          }
                          return [`¥${value.toLocaleString()}`, name];
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
                            return [`${value.toFixed(1)}%`, name];
                          }
                          return [`¥${value.toLocaleString()}`, name];
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

                {/* 貯蓄率と貯蓄額の推移 */}
                <div>
                  <h3 className="text-lg font-medium mb-4">貯蓄率と貯蓄額の推移</h3>
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
                            return [`${value.toFixed(1)}%`, name];
                          }
                          return [`¥${value.toLocaleString()}`, name];
                        }} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="totalSavings"
                          name="年間貯蓄額"
                          yAxisId="left"
                          fill="#82ca9d"
                          stroke="#82ca9d"
                        />
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

                {/* 年次詳細テーブル */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-4">年次詳細</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>年</TableHead>
                          <TableHead className="text-right">総収入</TableHead>
                          <TableHead className="text-right">総支出</TableHead>
                          <TableHead className="text-right">総貯蓄</TableHead>
                          <TableHead className="text-right">貯蓄率</TableHead>
                          <TableHead className="text-right">対前年比増加率</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {yearlyFinancials.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell>{data.year}</TableCell>
                            <TableCell className="text-right">¥{data.totalIncome.toLocaleString()}</TableCell>
                            <TableCell className="text-right">¥{data.totalExpenses.toLocaleString()}</TableCell>
                            <TableCell className="text-right">¥{data.totalSavings.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{data.savingsRate.toFixed(1)}%</TableCell>
                            <TableCell className="text-right">
                              {index === 0
                                ? '-'
                                : `${(((data.totalSavings / yearlyFinancials[index - 1].totalSavings) - 1) * 100).toFixed(1)}%`}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* 5年間の分析 */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-4">5年間の分析</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">5年間の総収入</div>
                        <div className="text-2xl font-bold">
                          ¥{yearlyFinancials.reduce((sum, data) => sum + data.totalIncome, 0).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">5年間の総支出</div>
                        <div className="text-2xl font-bold">
                          ¥{yearlyFinancials.reduce((sum, data) => sum + data.totalExpenses, 0).toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">5年間の総貯蓄</div>
                        <div className="text-2xl font-bold text-green-600">
                          ¥{yearlyFinancials.reduce((sum, data) => sum + data.totalSavings, 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-sm text-gray-500">収入増加率（初年度⇒最終年度）</div>
                      <div className="text-2xl font-bold">
                        {((yearlyFinancials[yearlyFinancials.length - 1].totalIncome /
                          yearlyFinancials[0].totalIncome -
                          1) *
                          100).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {reportType === 'category' && (
          <Card>
            <CardHeader>
              <CardTitle>カテゴリ別支出分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* カテゴリ別支出割合 */}
                <div>
                  <h3 className="text-lg font-medium mb-4">カテゴリ別支出割合</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryExpenses}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="amount"
                        >
                          {categoryExpenses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* カテゴリ別金額 */}
                <div>
                  <h3 className="text-lg font-medium mb-4">カテゴリ別金額</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryExpenses}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="category" />
                        <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                        <Bar dataKey="amount" name="支出額">
                          {categoryExpenses.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* カテゴリ別詳細テーブル */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-4">カテゴリ別詳細</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>カテゴリ</TableHead>
                          <TableHead className="text-right">年間支出額</TableHead>
                          <TableHead className="text-right">月平均</TableHead>
                          <TableHead className="text-right">割合</TableHead>
                          <TableHead>可視化</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryExpenses.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{data.category}</TableCell>
                            <TableCell className="text-right">¥{data.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              ¥{Math.round(data.amount / 12).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">{data.percentage.toFixed(1)}%</TableCell>
                            <TableCell>
                              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full"
                                  style={{
                                    width: `${data.percentage}%`,
                                    backgroundColor: COLORS[index % COLORS.length],
                                  }}
                                ></div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* 支出分析 */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-4">支出分析</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-4">
                      最も大きな支出カテゴリは「住居費」で、総支出の約40%を占めています。次いで「食費」が約25%を占めており、この2つのカテゴリで全体の約65%を占めています。
                    </p>
                    <p className="mb-4">
                      月間の食費は平均で¥
                      {Math.round(
                        categoryExpenses.find((c) => c.category === '食費')?.amount! / 12
                      ).toLocaleString()}
                      です。一般的な単身世帯の平均食費（月¥50,000〜60,000）と比較すると適切な範囲内にあります。
                    </p>
                    <p>
                      「娯楽費」と「その他」の支出を合わせると約13%で、バランスの取れた支出配分と言えるでしょう。なお、住居費の割合が高いため、今後の収入増加に伴い相対的な割合は徐々に減少していく見込みです。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {reportType === 'networth' && (
          <Card>
            <CardHeader>
              <CardTitle>純資産推移レポート</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 純資産の推移 */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-4">純資産の推移</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={netWorthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="assets" name="資産" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="liabilities" name="負債" stackId="a" fill="#ff7f7f" />
                        <Line
                          type="monotone"
                          dataKey="netWorth"
                          name="純資産"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 純資産成長率 */}
                <div>
                  <h3 className="text-lg font-medium mb-4">純資産成長率</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      {/* netWorthData.slice(1) を使用し、実際のインデックスは index+1 となるよう調整 */}
                      <LineChart data={netWorthData.slice(1)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis domain={[0, 500]} tickFormatter={(tick) => `${tick}%`} />
                        <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey={(data, index) => {
                            const actualIndex = index + 1; // slice(1) のため元データのインデックス
                            const prevNetWorth = netWorthData[actualIndex - 1].netWorth;
                            const currentNetWorth = data.netWorth;
                            return prevNetWorth > 0
                              ? ((currentNetWorth / prevNetWorth) - 1) * 100
                              : 0;
                          }}
                          name="年間成長率"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 負債比率の推移 */}
                <div>
                  <h3 className="text-lg font-medium mb-4">負債比率の推移</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={netWorthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
                        <Tooltip formatter={(value, name) => {
                          if (name === '負債比率') {
                            return [`${value.toFixed(1)}%`, name];
                          }
                          return [`¥${value.toLocaleString()}`, name];
                        }} />
                        <Legend />
                        <Bar
                          dataKey={(data) =>
                            data.assets > 0 ? (data.liabilities / data.assets) * 100 : 0
                          }
                          name="負債比率"
                          fill="#ff7f7f"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 純資産明細テーブル */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-4">純資産明細</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>年</TableHead>
                          <TableHead className="text-right">資産</TableHead>
                          <TableHead className="text-right">負債</TableHead>
                          <TableHead className="text-right">純資産</TableHead>
                          <TableHead className="text-right">負債比率</TableHead>
                          <TableHead className="text-right">年間増加額</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {netWorthData.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell>{data.year}</TableCell>
                            <TableCell className="text-right">¥{data.assets.toLocaleString()}</TableCell>
                            <TableCell className="text-right">¥{data.liabilities.toLocaleString()}</TableCell>
                            <TableCell className="text-right">¥{data.netWorth.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              {data.assets > 0
                                ? ((data.liabilities / data.assets) * 100).toFixed(1)
                                : 0}
                              %
                            </TableCell>
                            <TableCell className="text-right">
                              {index === 0
                                ? '-'
                                : `¥${(data.netWorth - netWorthData[index - 1].netWorth).toLocaleString()}`}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* 純資産分析 */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium mb-4">純資産分析</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-4">
                      初年度の純資産は¥{netWorthData[0].netWorth.toLocaleString()}と限定的ですが、
                      5年後には¥{netWorthData[netWorthData.length - 2].netWorth.toLocaleString()}、
                      6年後（借金完済時）には¥{netWorthData[netWorthData.length - 1].netWorth.toLocaleString()}まで増加する見込みです。
                    </p>
                    <p className="mb-4">
                      初年度の負債比率は
                      {((netWorthData[0].liabilities / netWorthData[0].assets) * 100).toFixed(1)}%
                      と高い水準にありますが、計画的な借金返済と資産形成により、5年後には
                      {((netWorthData[4].liabilities / netWorthData[4].assets) * 100).toFixed(1)}%
                      まで改善し、6年後には完全に負債がなくなる予定です。
                    </p>
                    <p>
                      純資産に対する年間成長率は、特に初期の数年間は著しく高く推移します。これは低い純資産ベースから始まるため当然ですが、資産形成が軌道に乗れば年間20〜30%の安定した成長率となるでしょう。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
