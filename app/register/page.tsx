// app/register/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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

const registerSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  confirmPassword: z.string().min(8, 'パスワードは8文字以上で入力してください'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "パスワードが一致しません",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });
  
  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    
    try {
      // Registration API call
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error || '登録処理中にエラーが発生しました');
        setIsLoading(false);
        return;
      }
      
      // Registration successful
      setSuccess('アカウントが作成されました！ログインしています...');
      
      // Auto-login the user
      setTimeout(async () => {
        const signInResult = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        
        if (signInResult?.error) {
          setError('ログインに失敗しました。ログインページからログインしてください。');
          setIsLoading(false);
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          // Successful login
          router.push('/dashboard');
        }
      }, 1500);
      
    } catch (error) {
      console.error('Registration error:', error);
      setError('サーバーエラーが発生しました。しばらくしてからもう一度お試しください。');
      setIsLoading(false);
    }
  };
  
  // Skip registration form and go straight to demo
  const goToDemo = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: 'demo@example.com',
        password: 'password123',
      });
      
      if (result?.error) {
        setError('デモログインに失敗しました。');
        setIsLoading(false);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('デモログイン処理中にエラーが発生しました');
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
              <CardTitle className="text-2xl font-bold dark:text-white">新規アカウント登録</CardTitle>
              <p className="mt-2 text-gray-600 dark:text-gray-300">無料で始めて、あなたの財務をコントロール</p>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <motion.div 
                  className="mb-4 p-3 rounded bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-300 text-sm border border-red-200 dark:border-red-800"
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
              
              {success && (
                <motion.div 
                  className="mb-4 p-3 rounded bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300 text-sm border border-green-200 dark:border-green-800"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {success}
                  </div>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    お名前
                  </label>
                  <Input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="例: 山田 太郎"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>
                
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
                    placeholder="半角英数字8文字以上"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    パスワード（確認）
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="同じパスワードを入力"
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="flex items-start mt-4">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700 dark:text-gray-300">
                      <span>
                        <Link href="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                          利用規約
                        </Link>{' '}
                        および{' '}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                          プライバシーポリシー
                        </Link>
                        に同意します
                      </span>
                    </label>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full flex justify-center items-center mt-6"
                  disabled={isLoading}
                >
                  {isLoading && !success ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      処理中...
                    </>
                  ) : '登録する'}
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
                  className="w-full dark:text-gray-300 dark:border-gray-600"
                  onClick={goToDemo}
                  disabled={isLoading}
                >
                  登録せずにデモを試す
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    すでにアカウントをお持ちですか？{' '}
                    <Link href="/login" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                      ログイン
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