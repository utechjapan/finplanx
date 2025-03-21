'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  // User input states
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  
  // Form input states
  const [incomeInput, setIncomeInput] = useState<string>('');
  const [expenseInput, setExpenseInput] = useState<string>('');
  
  // Monthly data state with empty initial values
  const [monthlyData, setMonthlyData] = useState([
    { month: '今月', income: 0, expenses: 0, savings: 0 }
  ]);
  
  // Empty initial expense categories
  const [expenseCategories, setExpenseCategories] = useState<{ name: string; value: number; color: string }[]>([]);
  
  // For adding a new expense category
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryAmount, setNewCategoryAmount] = useState('');
  
  // Colors for pie chart
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#ffc658', '#ff8042'];
  
  // Update income
  const handleIncomeUpdate = () => {
    const newIncome = parseFloat(incomeInput);
    if (!isNaN(newIncome) && newIncome >= 0) {
      setIncome(newIncome);
      updateMonthlySummary(newIncome, expenses);
      setIncomeInput('');
    }
  };
  
  // Update expense
  const handleExpenseUpdate = () => {
    const newExpense = parseFloat(expenseInput);
    if (!isNaN(newExpense) && newExpense >= 0) {
      setExpenses(newExpense);
      updateMonthlySummary(income, newExpense);
      setExpenseInput('');
    }
  };
  
  // Add expense category
  const addExpenseCategory = () => {
    const amount = parseFloat(newCategoryAmount);
    if (newCategoryName && !isNaN(amount) && amount > 0) {
      const newCategory = {
        name: newCategoryName,
        value: amount,
        color: COLORS[expenseCategories.length % COLORS.length]
      };
      
      const updatedCategories = [...expenseCategories, newCategory];
      setExpenseCategories(updatedCategories);
      
      // Update total expenses
      const totalExpenses = updatedCategories.reduce((sum, cat) => sum + cat.value, 0);
      setExpenses(totalExpenses);
      updateMonthlySummary(income, totalExpenses);
      
      // Reset inputs
      setNewCategoryName('');
      setNewCategoryAmount('');
    }
  };
  
  // Update monthly summary
  const updateMonthlySummary = (newIncome: number, newExpenses: number) => {
    const newSavings = newIncome - newExpenses;
    setSavings(newSavings);
    
    setMonthlyData([
      { month: '今月', income: newIncome, expenses: newExpenses, savings: newSavings }
    ]);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ダッシュボード</h1>
      
      {/* Input section */}
      <Card>
        <CardHeader>
          <CardTitle>あなたの財務情報を入力</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">収入</h3>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="月収を入力"
                  value={incomeInput}
                  onChange={(e) => setIncomeInput(e.target.value)}
                />
                <Button onClick={handleIncomeUpdate}>更新</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">支出</h3>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="総支出を入力"
                  value={expenseInput}
                  onChange={(e) => setExpenseInput(e.target.value)}
                />
                <Button onClick={handleExpenseUpdate}>更新</Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">支出カテゴリを追加</h3>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <Input
                placeholder="カテゴリ名"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="金額"
                value={newCategoryAmount}
                onChange={(e) => setNewCategoryAmount(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addExpenseCategory}>追加</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>今月の収入</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥{income.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今月の支出</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥{expenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今月の貯蓄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${savings < 0 ? 'text-red-500' : 'text-green-600'}`}>
              ¥{savings.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
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
              {expenseCategories.length > 0 ? (
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
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  支出カテゴリを追加して詳細を確認しましょう
                </div>
              )}
            </div>
            
            {expenseCategories.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">カテゴリ詳細</h4>
                <div className="space-y-2">
                  {expenseCategories.map((category, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span 
                          className="inline-block w-3 h-3 mr-2 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></span>
                        <span>{category.name}</span>
                      </div>
                      <span>¥{category.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>次のステップ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>あなたの財務状況をより詳細に管理するために、以下のセクションをご利用ください：</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>「収支管理」で詳細な収入と支出を記録</li>
              <li>「ライフプラン」で将来の財務目標を設定</li>
              <li>「借金返済計画」で借金の返済スケジュールを管理</li>
              <li>「資産形成」で投資戦略を立てる</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}