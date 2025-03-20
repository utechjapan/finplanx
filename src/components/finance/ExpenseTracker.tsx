// src/components/finance/ExpenseTracker.tsx
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';

const expenseSchema = z.object({
  amount: z.number().positive('金額は0より大きい数値を入力してください'),
  category: z.string().min(1, 'カテゴリを選択してください'),
  description: z.string().optional(),
  date: z.date(),
  isRecurring: z.boolean().default(false),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

const ExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category: '',
      description: '',
      date: new Date(),
      isRecurring: false,
    },
  });
  
  const onSubmit = (data: ExpenseFormData) => {
    setExpenses([...expenses, data]);
    reset();
  };
  
  // Expense categories
  const categories = [
    '食費', '住居費', '光熱費', '通信費', '交通費', 
    '娯楽費', '教育費', '医療費', '保険', 'その他'
  ];
  
  // Data for chart
  const chartData = categories.map(category => ({
    name: category,
    amount: expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0),
  }));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>支出登録</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium">金額</label>
              <Input 
                id="amount" 
                type="number"
                {...register('amount', { valueAsNumber: true })}
                className="mt-1"
              />
              {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium">カテゴリ</label>
              <Select 
                id="category"
                {...register('category')}
                className="mt-1"
              >
                <option value="">選択してください</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium">詳細 (任意)</label>
              <Input 
                id="description" 
                {...register('description')}
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium">日付</label>
              <DatePicker 
                id="date"
                {...register('date')}
                className="mt-1"
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
            </div>
            
            <div className="flex items-center">
              <input
                id="isRecurring"
                type="checkbox"
                {...register('isRecurring')}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="isRecurring" className="ml-2 block text-sm">定期的な支出</label>
            </div>
            
            <Button type="submit" className="w-full">追加</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ別支出</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="amount" name="金額" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseTracker;