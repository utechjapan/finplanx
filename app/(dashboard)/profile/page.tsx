'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { User, Mail, Phone, Home, Briefcase, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    dob: '',
    bio: ''
  });
  
  // Initialize form with session data
  useEffect(() => {
    if (session?.user) {
      setFormState(prev => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
        // Other fields would come from a more complete user profile in a real app
        phone: '090-1234-5678',
        address: '東京都新宿区',
        occupation: 'エンジニア',
        dob: '1990-01-01',
        bio: '趣味は読書と旅行です。将来的には自分の家を購入することが目標です。'
      }));
    }
  }, [session]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API endpoint
    // For now, we'll just simulate success
    setTimeout(() => {
      setSuccessMessage('プロフィールが更新されました');
      setIsEditing(false);
      
      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 800);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">プロフィール</h1>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-md">
          {successMessage}
        </div>
      )}
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>プロフィール情報</CardTitle>
          <Button 
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'キャンセル' : '編集'}
          </Button>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    お名前
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    メールアドレス
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    電話番号
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    住所
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formState.address}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-1">
                    職業
                  </label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formState.occupation}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    生年月日
                  </label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formState.dob}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  自己紹介
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formState.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  キャンセル
                </Button>
                <Button type="submit">保存</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
                <div className="mb-4 sm:mb-0 w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={40} />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold">{formState.name}</h2>
                  <p className="text-gray-600">{formState.occupation}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 mt-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">メール</p>
                    <p>{formState.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">電話番号</p>
                    <p>{formState.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Home size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">住所</p>
                    <p>{formState.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">職業</p>
                    <p>{formState.occupation}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">生年月日</p>
                    <p>{formState.dob}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">自己紹介</h3>
                <p className="text-gray-700">{formState.bio}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>アカウント連携</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#4285F4] rounded-full flex items-center justify-center text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Google</p>
                  <p className="text-sm text-gray-500">連携済み</p>
                </div>
              </div>
              <Button variant="outline" size="sm">解除</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">GitHub</p>
                  <p className="text-sm text-gray-500">未連携</p>
                </div>
              </div>
              <Button variant="outline" size="sm">連携する</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>パスワード変更</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                現在のパスワード
              </label>
              <Input
                id="current-password"
                type="password"
                placeholder="現在のパスワードを入力"
              />
            </div>
            
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                新しいパスワード
              </label>
              <Input
                id="new-password"
                type="password"
                placeholder="新しいパスワードを入力"
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                新しいパスワード（確認）
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="新しいパスワードを再入力"
              />
            </div>
            
            <div className="flex justify-end">
              <Button>パスワードを変更</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">危険エリア</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">以下の操作はアカウントのデータに影響を与えます。操作は慎重に行ってください。</p>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <div>
                <h3 className="font-medium">アカウントデータの削除</h3>
                <p className="text-sm text-gray-500">すべてのデータを削除し、アカウントをリセットします</p>
              </div>
              <Button variant="outline">データを削除</Button>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div>
                  <h3 className="font-medium text-red-600">アカウントの削除</h3>
                  <p className="text-sm text-gray-500">アカウントを完全に削除します。この操作は元に戻せません</p>
                </div>
                <Button variant="destructive">アカウントを削除</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}