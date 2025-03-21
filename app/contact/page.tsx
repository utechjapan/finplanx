// app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Mock API call for demo purposes
      // In a real app, you would send the form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitError('メッセージの送信に失敗しました。しばらくしてからもう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">F</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">FinPlanX</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link 
              href="/login" 
              className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              ログイン
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              無料登録
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">お問い合わせ</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
              ご質問やフィードバックがございましたら、以下のフォームからお気軽にお問い合わせください。
            </p>

            <Card className="p-8 shadow-lg bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {submitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="mb-4 text-green-500 dark:text-green-400">
                    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">お問い合わせありがとうございます</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    メッセージを受け付けました。できるだけ早くご返信いたします。
                  </p>
                  <Button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-6 py-2"
                  >
                    新しいメッセージを送信
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-300 p-4 rounded-md border border-red-200 dark:border-red-800 mb-4">
                      {submitError}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        お名前 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full dark:bg-gray-700 dark:border-gray-600"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        メールアドレス <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full dark:bg-gray-700 dark:border-gray-600"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      件名 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formState.subject}
                      onChange={handleChange}
                      className="w-full dark:bg-gray-700 dark:border-gray-600"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      メッセージ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formState.message}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          送信中...
                        </>
                      ) : '送信する'}
                    </Button>
                  </div>
                </form>
              )}
            </Card>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">お問い合わせ先</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  お問い合わせフォーム以外にも、以下の方法でご連絡いただけます：
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="text-blue-600 dark:text-blue-400 mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">メール</p>
                      <p className="text-gray-600 dark:text-gray-400">contact@finplanx-app.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-blue-600 dark:text-blue-400 mr-3">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">サポート</p>
                      <p className="text-gray-600 dark:text-gray-400">平日10:00-18:00に対応しています</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">よくある質問</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">FinPlanXは無料で使えますか？</h3>
                    <p className="text-gray-600 dark:text-gray-400">はい、基本機能はすべて無料でご利用いただけます。</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">アカウントを削除するにはどうすればいいですか？</h3>
                    <p className="text-gray-600 dark:text-gray-400">設定ページからアカウント削除を選択することで可能です。</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">データはセキュアに保存されますか？</h3>
                    <p className="text-gray-600 dark:text-gray-400">はい、すべてのデータは暗号化され、安全に保管されます。</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    href="/faq" 
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    <span>すべてのFAQを見る</span>
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} FinPlanX. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                プライバシーポリシー
              </Link>
              <Link href="/terms" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                利用規約
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}