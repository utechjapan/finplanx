'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/src/components/ui/Tabs';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/src/components/ui/Table';
import { DatePicker } from '@/src/components/ui/DatePicker';
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

const expenseCategories = [
  { name: '住居費', value: 80000, color: '#8884d8' },
  { name: '食費', value: 50000, color: '#83a6ed' },
  { name: '通信費', value: 12000, color: '#8dd1e1' },
  { name: '光熱費', value: 15000, color: '#82ca9d' },
  { name: '交通費', value: 18000, color: '#a4de6c' },
  { name: 'その他', value: 45000, color: '#ffc658' }
];

const recentTransactions = [
  { id: 1, date: '2025-05-15', category: '食費', description: 'スーパーでの買い物', amount: -8500 },
  { id: 2, date: '2025-05-14', category: '交通費', description: '電車定期券', amount: -12000 },
  { id: 3, date: '2025-05-12', category: '住居費', description: '家賃支払い', amount: -80000 },
  { id: 4, date: '2025-05-10', category: '収入', description: '給与', amount: 290000 },
  { id: 5, date: '2025-05-08', category: '通信費', description: '携帯電話料金', amount: -7800 },
  { id: 6, date: '2025-05-05', category: '娯楽費', description: '映画鑑賞', amount: -1800 },
  { id: 7, date: '2025-05-03', category: '食費', description: '外食', amount: -3200 },
];

const budgetData = [
  { category: '住居費', budgeted: 80000, spent: 80000, remaining: 0, percentage: 100 },
  { category: '食費', budgeted: 60000, spent: 48500, remaining: 11500, percentage: 80.8 },
  { category: '通信費', budgeted: 12000, spent: 7800, remaining: 4200, percentage: 65 },
  { category: '光熱費', budgeted: 15000, spent: 9200, remaining: 5800, percentage: 61.3 },
  { category: '交通費', budgeted: 20000, spent: 15000, remaining: 5000, percentage: 75 },
  { category: '娯楽費', budgeted: 30000, spent: 12000, remaining: 18000, percentage: 40 },
  { category: 'その他', budgeted: 45000, spent: 22000, remaining: 23000, percentage: 48.9 },
];

export default function FinancesPage() {
  const [newTransactionAmount, setNewTransactionAmount] = useState<string>('');
  const [newTransactionCategory, setNewTransactionCategory] = useState<string>('食費');
  const [newTransactionDescription, setNewTransactionDescription] = useState<string>('');
  const [newTransactionDate, setNewTransactionDate] = useState<Date>(new Date());

  const handleNewTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    // 実際には新しい取引をデータベースに保存する処理が必要
    alert('新しい取引が登録されました。実際の実装では、この取引がデータベースに保存されます。');
    
    // フォームをリセット
    setNewTransactionAmount('');
    setNewTransactionCategory('食費');
    setNewTransactionDescription('');
    setNewTransactionDate(new Date());
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">収支管理</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>今月の収入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥290,000</div>
            <p className="text-sm text-gray-500 mt-2">前月比: ±0%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今月の支出</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥195,000</div>
            <p className="text-sm text-gray-500 mt-2">予算の65%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今月の貯蓄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥95,000</div>
            <p className="text-sm text-gray-500 mt-2">目標の95%</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="overview" className="flex-1">概要</TabsTrigger>
          <TabsTrigger value="transactions" className="flex-1">取引履歴</TabsTrigger>
          <TabsTrigger value="budget" className="flex-1">予算管理</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
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
                <CardTitle>支出カテゴリ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
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
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <CardTitle>取引履歴</CardTitle>
              <Button variant="outline" onClick={() => document.getElementById('new-transaction-form')?.scrollIntoView({ behavior: 'smooth' })}>
                新規取引を追加
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日付</TableHead>
                      <TableHead>カテゴリ</TableHead>
                      <TableHead>内容</TableHead>
                      <TableHead className="text-right">金額</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString('ja-JP')}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className={`text-right ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {transaction.amount.toLocaleString()}円
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div id="new-transaction-form" className="mt-8 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-medium mb-4">新規取引の追加</h3>
                <form onSubmit={handleNewTransaction} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                        金額 (収入は正の値、支出は負の値)
                      </label>
                      <Input
                        id="amount"
                        type="number"
                        value={newTransactionAmount}
                        onChange={(e) => setNewTransactionAmount(e.target.value)}
                        placeholder="-1000 (支出の場合はマイナス)"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        カテゴリ
                      </label>
                      <Select
                        id="category"
                        value={newTransactionCategory}
                        onChange={(e) => setNewTransactionCategory(e.target.value)}
                        required
                      >
                        <option value="収入">収入</option>
                        <option value="住居費">住居費</option>
                        <option value="食費">食費</option>
                        <option value="通信費">通信費</option>
                        <option value="光熱費">光熱費</option>
                        <option value="交通費">交通費</option>
                        <option value="娯楽費">娯楽費</option>
                        <option value="その他">その他</option>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        内容
                      </label>
                      <Input
                        id="description"
                        type="text"
                        value={newTransactionDescription}
                        onChange={(e) => setNewTransactionDescription(e.target.value)}
                        placeholder="取引の説明"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        日付
                      </label>
                      <DatePicker
                        id="date"
                        value={newTransactionDate}
                        onChange={(date) => date && setNewTransactionDate(date)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit">取引を追加</Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>予算管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>カテゴリ</TableHead>
                      <TableHead>予算額</TableHead>
                      <TableHead>使用額</TableHead>
                      <TableHead>残額</TableHead>
                      <TableHead>使用率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetData.map((item) => (
                      <TableRow key={item.category}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>¥{item.budgeted.toLocaleString()}</TableCell>
                        <TableCell>¥{item.spent.toLocaleString()}</TableCell>
                        <TableCell>¥{item.remaining.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  item.percentage > 90 ? 'bg-red-500' : 
                                  item.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm">{item.percentage}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">総括</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">総予算</div>
                    <div className="text-2xl font-bold">
                      ¥{budgetData.reduce((sum, item) => sum + item.budgeted, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">総支出</div>
                    <div className="text-2xl font-bold">
                      ¥{budgetData.reduce((sum, item) => sum + item.spent, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">残額</div>
                    <div className="text-2xl font-bold text-green-600">
                      ¥{budgetData.reduce((sum, item) => sum + item.remaining, 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}