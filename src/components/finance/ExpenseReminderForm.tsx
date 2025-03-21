// src/components/finance/ExpenseReminderForm.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { DatePicker } from '@/src/components/ui/DatePicker';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Button } from '@/src/components/ui/Button';
import { useNotifications } from '@/src/components/providers/NotificationProvider';
import { format, addDays } from 'date-fns';

interface ExpenseReminderFormProps {
  onCreated?: () => void;
}

const ExpenseReminderForm: React.FC<ExpenseReminderFormProps> = ({ onCreated }) => {
  const { createNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    expenseName: '',
    amount: '',
    category: '家賃・住宅',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to 7 days from now
    reminderDays: '3', // Days before due date to send reminder
    note: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(null);
    
    try {
      // Calculate the reminder date (dueDate - reminderDays)
      const reminderDate = addDays(formData.dueDate, -parseInt(formData.reminderDays));
      
      // Create the reminder notification
      await createNotification({
        title: `${formData.expenseName}の支払い期限が近づいています`,
        message: `¥${formData.amount}の${formData.expenseName}の支払い期限は${format(formData.dueDate, 'yyyy年MM月dd日')}です。${formData.note ? `\n備考: ${formData.note}` : ''}`,
        type: 'expense_reminder',
        targetDate: formData.dueDate
      });
      
      // Show success message
      setSuccess('リマインダーが正常に設定されました！');
      
      // Reset form
      setFormData({
        expenseName: '',
        amount: '',
        category: '家賃・住宅',
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        reminderDays: '3',
        note: ''
      });
      
      // Call onCreated callback if provided
      if (onCreated) {
        onCreated();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
      
    } catch (error) {
      console.error('Failed to create reminder:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>支出リマインダーを設定</CardTitle>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-md mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expenseName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                支出名 <span className="text-red-500">*</span>
              </label>
              <Input
                id="expenseName"
                name="expenseName"
                value={formData.expenseName}
                onChange={handleChange}
                required
                placeholder="例: 家賃"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                金額 <span className="text-red-500">*</span>
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                placeholder="例: 80000"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                カテゴリ
              </label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="家賃・住宅">家賃・住宅</option>
                <option value="水道・光熱費">水道・光熱費</option>
                <option value="通信費">通信費</option>
                <option value="保険">保険</option>
                <option value="サブスクリプション">サブスクリプション</option>
                <option value="ローン">ローン</option>
                <option value="その他">その他</option>
              </Select>
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                支払期限日 <span className="text-red-500">*</span>
              </label>
              <DatePicker
                id="dueDate"
                value={formData.dueDate}
                onChange={(date) => date && setFormData({...formData, dueDate: date})}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="reminderDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                何日前に通知するか
              </label>
              <Select
                id="reminderDays"
                name="reminderDays"
                value={formData.reminderDays}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="1">1日前</option>
                <option value="2">2日前</option>
                <option value="3">3日前</option>
                <option value="5">5日前</option>
                <option value="7">7日前</option>
                <option value="14">14日前</option>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                メモ (任意)
              </label>
              <textarea
                id="note"
                name="note"
                rows={3}
                value={formData.note}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                placeholder="備考や補足情報"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  設定中...
                </>
              ) : 'リマインダーを設定'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseReminderForm;