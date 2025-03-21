'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Bell, Mail, Shield, Globe, Monitor, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [formState, setFormState] = useState({
    language: 'ja',
    currency: 'JPY',
    theme: 'system',
    timezone: 'Asia/Tokyo',
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API endpoint
    // For now, we'll just simulate success
    setSuccessMessage('設定が更新されました');
    
    // Clear the success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">設定</h1>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-md">
          {successMessage}
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>一般設定</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  言語
                </label>
                <Select
                  id="language"
                  name="language"
                  value={formState.language}
                  onChange={handleChange}
                >
                  <option value="ja">日本語</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                  <option value="ko">한국어</option>
                </Select>
              </div>
              
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                  通貨
                </label>
                <Select
                  id="currency"
                  name="currency"
                  value={formState.currency}
                  onChange={handleChange}
                >
                  <option value="JPY">日本円 (¥)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </Select>
              </div>
              
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                  テーマ
                </label>
                <Select
                  id="theme"
                  name="theme"
                  value={formState.theme}
                  onChange={handleChange}
                >
                  <option value="light">ライトモード</option>
                  <option value="dark">ダークモード</option>
                  <option value="system">システム設定に合わせる</option>
                </Select>
              </div>
              
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                  タイムゾーン
                </label>
                <Select
                  id="timezone"
                  name="timezone"
                  value={formState.timezone}
                  onChange={handleChange}
                >
                  <option value="Asia/Tokyo">東京 (GMT+9:00)</option>
                  <option value="America/New_York">ニューヨーク (GMT-5:00)</option>
                  <option value="Europe/London">ロンドン (GMT+0:00)</option>
                  <option value="Europe/Paris">パリ (GMT+1:00)</option>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">保存</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>通知設定</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-medium">メール通知</p>
                  <p className="text-sm text-gray-500">重要なアラートや更新情報をメールで受け取る</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  name="emailNotifications"
                  checked={formState.emailNotifications}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="font-medium">プッシュ通知</p>
                  <p className="text-sm text-gray-500">ブラウザでプッシュ通知を受け取る</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  name="pushNotifications"
                  checked={formState.pushNotifications}
                  onChange={handleChange}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after