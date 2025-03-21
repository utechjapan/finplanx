// app/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { Button } from '@/src/components/ui/Button';

export default function Home() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);
  
  // Animation settings
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  // Features data
  const features = [
    {
      title: '収支管理',
      description: '月次・年次の収支計画と実績追跡。カテゴリ別支出分析と予算設定で、お金の流れを可視化します。',
      icon: '/icons/wallet.svg'
    },
    {
      title: 'ライフプラン作成',
      description: '5年、10年、30年の人生イベントをシミュレーションし、財務影響を可視化。将来の準備を今から始めましょう。',
      icon: '/icons/calendar.svg'
    },
    {
      title: '借金返済計画',
      description: '複数の借金の一元管理と、効率的な返済戦略のシミュレーション。賢い返済計画で負債から解放されましょう。',
      icon: '/icons/credit-card.svg'
    },
    {
      title: '資産形成シミュレーション',
      description: '投資ポートフォリオの作成・管理と長期的な資産成長予測。あなたの資産を最大化する戦略を立てましょう。',
      icon: '/icons/chart-up.svg'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: '田中 健太',
      position: '会社員 / 35歳',
      quote: 'FinPlanXのおかげで住宅ローンと教育資金の計画が立てられました。将来への不安が減り、毎月の貯蓄額も増えました。',
      avatar: '/avatars/avatar-1.jpg'
    },
    {
      name: '佐藤 美咲',
      position: 'フリーランス / 28歳',
      quote: '収入が不安定な仕事なので家計管理が難しかったですが、このアプリで見える化できて安心して働けるようになりました。',
      avatar: '/avatars/avatar-2.jpg'
    },
    {
      name: '鈴木 大輔',
      position: '自営業 / 42歳',
      quote: '複数の借金を効率的に返済する方法を見つけられました。金利の高いものから返済するアバランチ方式を知れて助かりました。',
      avatar: '/avatars/avatar-3.jpg'
    }
  ];

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

      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                  あなた専用の<br />
                  <span className="text-blue-600 dark:text-blue-400">財務計画</span>アプリ
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
                  収支管理、ライフプラン作成、借金返済計画、資産形成シミュレーションを一元管理。あなたの財務目標達成をサポートします。
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link 
                    href="/demo" 
                    className="px-8 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-center"
                  >
                    無料でシミュレーション
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-8 py-3 bg-white dark:bg-gray-800 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-center"
                  >
                    アカウント登録
                  </Link>
                </div>
              </motion.div>
              <motion.div 
                className="md:w-1/2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src="/dashboard-preview.png" 
                    alt="FinPlanXダッシュボードのプレビュー" 
                    className="w-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 dark:text-white">主な機能</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                FinPlanXはあなたの財務状況を包括的に管理し、より良い資産形成を実現するための機能を提供します
              </p>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
                  variants={item}
                  whileHover={{ y: -5 }}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="h-14 w-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                    <img src={feature.icon} alt={feature.title} className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How to use section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 dark:text-white">簡単3ステップで始める</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                FinPlanXはシンプルに設計されており、誰でも簡単に始められます
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">アカウント登録</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  無料でアカウントを作成し、基本的な財務情報を入力します。
                </p>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">目標設定</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  あなたの財務目標（貯蓄、投資、返済など）を設定します。
                </p>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white">計画実行</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  最適な財務計画を実行し、進捗をリアルタイムでトラッキング。
                </p>
              </motion.div>
            </div>

            <div className="mt-16 text-center">
              <Link 
                href="/register" 
                className="px-8 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors inline-block"
              >
                無料で始める
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 dark:text-white">ユーザーの声</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                多くのユーザーがFinPlanXで財務目標を達成しています
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="h-14 w-14 rounded-full overflow-hidden mr-4 bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold dark:text-white">{testimonial.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.position}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20 bg-blue-600 dark:bg-blue-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6">あなたの財務計画を今日から始めましょう</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                登録は無料です。アカウントを作成して、あなたの財務目標への第一歩を踏み出しましょう。
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/register" 
                  className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors"
                >
                  無料で登録する
                </Link>
                <Link 
                  href="/demo" 
                  className="px-8 py-3 border border-white text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-900 transition-colors"
                >
                  デモを試す
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">F</span>
                </div>
                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">FinPlanX</h2>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
                個人の財務計画作成を支援するツール。将来への資産形成をサポートします。
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">プライバシーポリシー</Link>
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">利用規約</Link>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">お問い合わせ</Link>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center mt-8">
            <p className="text-gray-600 dark:text-gray-400">&copy; {new Date().getFullYear()} FinPlanX. All rights reserved.</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 md:mt-0">
              このサイトは個人が制作した無料ツールです。金融アドバイスではありません。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}