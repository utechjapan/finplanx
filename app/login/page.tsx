// app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');
  
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(error ? 'ログインに失敗しました。メールアドレスとパスワードを確認してください。' : null);
  
  // Reset error when user changes input
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        setAuthError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authError]);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });
  
  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      
      if (result?.error) {
        setAuthError('ログインに失敗しました。メールアドレスとパスワードを確認してください。');
        setIsLoading(false);
      } else {
        // Successful login
        router.push(callbackUrl);
      }
    } catch (error) {
      setAuthError('ログイン処理中にエラーが発生しました');
      setIsLoading(false);
      console.error('Login error:', error);
    }
  };

  // Handle demo login - improved implementation
  const loginAsDemo = async () => {
    setIsLoading(true);
    // Pre-fill the form fields with demo credentials
    setValue('email', 'demo@example.com');
    setValue('password', 'password123');
    
    try {
      // Short delay to show the credentials being filled in
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = await signIn('credentials', {
        redirect: false,
        email: 'demo@example.com',
        password: 'password123',
      });
      
      if (result?.error) {
        console.error('Demo login error:', result.error);
        setAuthError('デモログインに失敗しました。DEMO_MODE環境変数が設定されているか確認してください。');
        setIsLoading(false);
      } else {
        // Successful login
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setAuthError('デモログイン処理中にエラーが発生しました');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">F</span>
              </div>
              <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">FinPlanX</h1>
            </Link>
            <ThemeToggle />
          </div>

          <Card className="shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="text-center border-b pb-6 dark:border-gray-700">
              <CardTitle className="text-2xl font-bold dark:text-white">アカウントにログイン</CardTitle>
              <p className="mt-2 text-gray-600 dark:text-gray-300">あなたの財務計画を管理しましょう</p>
            </CardHeader>
            <CardContent className="pt-6">
              {authError && (
                <motion.div 
                  className="mb-4 p-3 rounded bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-300 text-sm border border-red-200 dark:border-red-800"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {authError}
                  </div>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    メールアドレス
                  </label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="例: user@example.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    パスワード
                  </label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="パスワードを入力"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      ログイン状態を保持
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
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
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">または</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full dark:text-gray-300 dark:border-gray-600 dark:hover:bg-blue-600 dark:hover:text-white"
                  onClick={loginAsDemo}
                  disabled={isLoading}
                >
                  デモユーザーとしてログイン
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    アカウントをお持ちでない方は{' '}
                    <Link href="/register" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                      新規登録
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              &larr; ホームページに戻る
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}