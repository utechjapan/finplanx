'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { DatePicker } from '@/src/components/ui/DatePicker';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  // User financial data
  const [userData, setUserData] = useState({
    income: {
      baseSalary: 0,
      overtime: 0,
      allowances: 0,
    },
    expenses: [] as {id: string, category: string, amount: number, description: string}[],
    savings: 0,
  });
  
  // Form input states
  const [incomeInput, setIncomeInput] = useState({
    baseSalary: '',
    overtime: '',
    allowances: '',
  });
  const [expenseInput, setExpenseInput] = useState({
    category: '食費',
    amount: '',
    description: '',
  });
  
  // Monthly data state with empty initial values
  const [monthlyData, setMonthlyData] = useState([
    { month: '今月', income: 0, expenses: 0, savings: 0 }
  ]);
  
  // Empty initial expense categories
  const [expenseCategories, setExpenseCategories] = useState<{ name: string; value: number; color: string }[]>([]);
  
  // Colors for pie chart
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#ffc658', '#ff8042'];
  
  // Handle income update
  const handleIncomeUpdate = (field: string) => {
    const value = parseFloat(incomeInput[field as keyof typeof incomeInput]);
    if (!isNaN(value) && value >= 0) {
      setUserData({
        ...userData,
        income: {
          ...userData.income,
          [field]: value,
        }
      });
      
      // Recalculate totals
      const totalIncome = calculateTotalIncome({
        ...userData.income,
        [field]: value,
      });
      
      const totalExpenses = userData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const newSavings = totalIncome - totalExpenses;
      
      setUserData(prev => ({
        ...prev,
        savings: newSavings
      }));
      
      // Update monthly data
      setMonthlyData([
        { month: '今月', income: totalIncome, expenses: totalExpenses, savings: newSavings }
      ]);
      
      setIncomeInput({
        ...incomeInput,
        [field]: '',
      });
    }
  };
  
  // Calculate total income from all sources
  const calculateTotalIncome = (income: typeof userData.income) => {
    return income.baseSalary + income.overtime + income.allowances;
  };
  
  // Add new expense
  const handleAddExpense = () => {
    const amount = parseFloat(expenseInput.amount);
    if (!isNaN(amount) && amount > 0 && expenseInput.category) {
      const newExpense = {
        id: Date.now().toString(),
        category: expenseInput.category,
        amount: amount,
        description: expenseInput.description,
      };
      
      const updatedExpenses = [...userData.expenses, newExpense];
      
      // Recalculate totals
      const totalIncome = calculateTotalIncome(userData.income);
      const totalExpenses = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const newSavings = totalIncome - totalExpenses;
      
      setUserData({
        ...userData,
        expenses: updatedExpenses,
        savings: newSavings
      });
      
      // Update monthly data
      setMonthlyData([
        { month: '今月', income: totalIncome, expenses: totalExpenses, savings: newSavings }
      ]);
      
      // Update expense categories for visualization
      const categories: Record<string, {value: number, color: string}> = {};
      
      updatedExpenses.forEach((expense, index) => {
        if (categories[expense.category]) {
          categories[expense.category].value += expense.amount;
        } else {
          categories[expense.category] = {
            value: expense.amount,
            color: COLORS[Object.keys(categories).length % COLORS.length]
          };
        }
      });
      
      setExpenseCategories(
        Object.keys(categories).map(name => ({
          name,
          value: categories[name].value,
          color: categories[name].color
        }))
      );
      
      // Reset input
      setExpenseInput({
        category: '食費',
        amount: '',
        description: '',
      });
    }
  };
  
  // Remove an expense
  const handleRemoveExpense = (id: string) => {
    const updatedExpenses = userData.expenses.filter(expense => expense.id !== id);
    
    // Recalculate totals
    const totalIncome = calculateTotalIncome(userData.income);
    const totalExpenses = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const newSavings = totalIncome - totalExpenses;
    
    setUserData({
      ...userData,
      expenses: updatedExpenses,
      savings: newSavings
    });
    
    // Update monthly data
    setMonthlyData([
      { month: '今月', income: totalIncome, expenses: totalExpenses, savings: newSavings }
    ]);
    
    // Update expense categories
    if (updatedExpenses.length === 0) {
      setExpenseCategories([]);
    } else {
      const categories: Record<string, {value: number, color: string}> = {};
      
      updatedExpenses.forEach((expense) => {
        if (categories[expense.category]) {
          categories[expense.category].value += expense.amount;
        } else {
          categories[expense.category] = {
            value: expense.amount,
            color: COLORS[Object.keys(categories).length % COLORS.length]
          };
        }
      });
      
      setExpenseCategories(
        Object.keys(categories).map(name => ({
          name,
          value: categories[name].value,
          color: categories[name].color
        }))
      );
    }
  };
  
  // Total income calculated from all sources
  const totalIncome = calculateTotalIncome(userData.income);
  
  // Total expenses
  const totalExpenses = userData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">ダッシュボード</h1>
      
      {/* Input section */}
      <Card>
        <CardHeader>
          <CardTitle>財務情報を入力</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">収入</h3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="基本給を入力"
                    value={incomeInput.baseSalary}
                    onChange={(e) => setIncomeInput({...incomeInput, baseSalary: e.target.value})}
                    className="flex-grow"
                  />
                  <Button onClick={() => handleIncomeUpdate('baseSalary')}>追加</Button>
                </div>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="みなし残業代を入力"
                    value={incomeInput.overtime}
                    onChange={(e) => setIncomeInput({...incomeInput, overtime: e.target.value})}
                    className="flex-grow"
                  />
                  <Button onClick={() => handleIncomeUpdate('overtime')}>追加</Button>
                </div>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="諸手当を入力"
                    value={incomeInput.allowances}
                    onChange={(e) => setIncomeInput({...incomeInput, allowances: e.target.value})}
                    className="flex-grow"
                  />
                  <Button onClick={() => handleIncomeUpdate('allowances')}>追加</Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">支出</h3>
              <div className="flex flex-col space-y-3">
                <Select
                  value={expenseInput.category}
                  onChange={(e) => setExpenseInput({...expenseInput, category: e.target.value})}
                >
                  <option value="食費">食費</option>
                  <option value="住居費">住居費</option>
                  <option value="光熱費">光熱費</option>
                  <option value="通信費">通信費</option>
                  <option value="交通費">交通費</option>
                  <option value="娯楽費">娯楽費</option>
                  <option value="医療費">医療費</option>
                  <option value="教育費">教育費</option>
                  <option value="その他">その他</option>
                </Select>
                <Input
                  type="number"
                  placeholder="支出額を入力"
                  value={expenseInput.amount}
                  onChange={(e) => setExpenseInput({...expenseInput, amount: e.target.value})}
                />
                <Input
                  type="text"
                  placeholder="説明（任意）"
                  value={expenseInput.description}
                  onChange={(e) => setExpenseInput({...expenseInput, description: e.target.value})}
                />
                <Button onClick={handleAddExpense}>支出を追加</Button>
              </div>
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
            <div className="text-3xl font-bold">¥{totalIncome.toLocaleString()}</div>
            <div className="mt-2 text-sm">
              <div>基本給: ¥{userData.income.baseSalary.toLocaleString()}</div>
              <div>残業代: ¥{userData.income.overtime.toLocaleString()}</div>
              <div>諸手当: ¥{userData.income.allowances.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今月の支出</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">¥{totalExpenses.toLocaleString()}</div>
            <p className="text-sm text-gray-500 mt-2">
              {userData.expenses.length}件の支出
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今月の貯蓄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${userData.savings < 0 ? 'text-red-500' : 'text-green-600'}`}>
              ¥{userData.savings.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {userData.savings < 0 ? '赤字です！支出を見直しましょう' : '黒字です！'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Expense list */}
      {userData.expenses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>支出一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">カテゴリ</th>
                    <th className="text-left py-2">金額</th>
                    <th className="text-left py-2">説明</th>
                    <th className="text-right py-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.expenses.map(expense => (
                    <tr key={expense.id} className="border-b">
                      <td className="py-2">{expense.category}</td>
                      <td className="py-2">¥{expense.amount.toLocaleString()}</td>
                      <td className="py-2">{expense.description}</td>
                      <td className="py-2 text-right">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveExpense(expense.id)}
                        >
                          削除
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Charts - only show if we have some data */}
      {(totalIncome > 0 || totalExpenses > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>収支バランス</CardTitle>
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
          
          {/* Only show expense breakdown if we have expenses */}
          {expenseCategories.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>支出カテゴリ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={expenseCategories}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="value" name="金額" fill="#8884d8">
                        {expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
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
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
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