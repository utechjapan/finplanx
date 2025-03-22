'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, AlertTriangle } from 'lucide-react';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { Button } from '@/src/components/ui/Button';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [isVerifying, setIsVerifying] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      setResult({
        success: false,
        error: 'トークンが見つかりません。URLが正しいことを確認してください。'
      });
      return;
    }

    // Call the verification API
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/verify-email/${token}`);
        
        if (response.ok) {
          setResult({
            success: true,
            message: 'メールアドレスが確認されました。ログインしてください。'
          });
        } else {
          const data = await response.json();
          setResult({
            success: false,
            error: data.error || 'メールアドレスの確認中にエラーが発生しました'
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
        setResult({
          success: false,
          error: 'サーバーエラーが発生しました'
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

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

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">メールアドレスの確認</h2>
              
              {isVerifying ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">メールアドレスを確認中...</p>
                </div>
              ) : result?.success ? (
                <div className="py-8">
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-4">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-medium text-green-600 dark:text-green-400 mb-2">確認完了</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{result.message}</p>
                  <Button
                    onClick={() => router.push('/login')}
                    className="w-full"
                  >
                    ログインページへ
                  </Button>
                </div>
              ) : (
                <div className="py-8">
                  <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900 mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-medium text-red-600 dark:text-red-400 mb-2">確認エラー</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{result?.error}</p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push('/login')}
                      className="w-full"
                    >
                      ログインページへ
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/register')}
                      className="w-full"
                    >
                      新規登録ページへ
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}