// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });
  
  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      // 実際の認証処理はここに実装
      // 今回はモック認証
      setTimeout(() => {
        if (data.email === 'user@example.com' && data.password === 'password123') {
          // 認証成功
          router.push('/dashboard');
        } else {
          // 認証失敗
          setError('メールアドレスまたはパスワードが正しくありません');
          setIsLoading(false);
        }
      }, 1000);
    } catch (error) {
      setError('ログイン処理中にエラーが発生しました');
      setIsLoading(false);
      console.error('Login error:', error);
    }
  };

  // デモユーザーとしてログイン
  const loginAsDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">F</span>
              </div>
              <h1 className="text-3xl font-bold text-blue-600">FinPlanX</h1>
            </Link>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center border-b pb-6">
              <CardTitle className="text-2xl font-bold">アカウントにログイン</CardTitle>
              <p className="mt-2 text-gray-600">あなたの財務計画を管理しましょう</p>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <motion.div 
                  className="mb-4 p-3 rounded bg-red-50 text-red-500 text-sm border border-red-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    メールアドレス
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="mt-1"
                    placeholder="例: user@example.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    パスワード
                  </label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="mt-1"
                    placeholder="半角英数字8文字以上"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      ログイン状態を保持
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500">
                      パスワードをお忘れですか？
                    </Link>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full flex justify-center items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      ログイン中...
                    </>
                  ) : 'ログイン'}
                </Button>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">または</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={loginAsDemo}
                  disabled={isLoading}
                >
                  デモユーザーとしてログイン
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    アカウントをお持ちでない方は{' '}
                    <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                      新規登録
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-4 text-center text-sm text-gray-600">
            <Link href="/" className="text-blue-600 hover:text-blue-500">
              &larr; ホームページに戻る
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}