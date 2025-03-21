// app/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);
  
  // アニメーション設定
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
  
  // 機能紹介データ
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

  // 体験談データ
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
      {/* ヘッダー */}
      <header className="bg-white py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-white">F</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-600">FinPlanX</h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors">機能</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">料金</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">会社情報</Link>
            <Link href="/demo" className="text-gray-600 hover:text-blue-600 transition-colors">無料体験</Link>
          </nav>
          <div className="flex space-x-3">
            <Link 
              href="/login" 
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              ログイン
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              無料登録
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  あなた専用の<br />
                  <span className="text-blue-600">財務計画</span>アプリ
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-xl">
                  収支管理、ライフプラン作成、借金返済計画、資産形成シミュレーションを一元管理。あなたの財務目標達成をサポートします。
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link 
                    href="/demo" 
                    className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                  >
                    無料でシミュレーション
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-8 py-3 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-center"
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
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
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

        {/* 主な機能セクション */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">主な機能</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                  className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  variants={item}
                  whileHover={{ y: -5 }}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <img src={feature.icon} alt={feature.title} className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 使い方セクション */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">簡単3ステップで始める</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                FinPlanXはシンプルに設計されており、誰でも簡単に始められます
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white rounded-lg p-6 shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">アカウント登録</h3>
                <p className="text-gray-600">
                  無料でアカウントを作成し、基本的な財務情報を入力します。
                </p>
              </motion.div>

              <motion.div 
                className="bg-white rounded-lg p-6 shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">目標設定</h3>
                <p className="text-gray-600">
                  あなたの財務目標（貯蓄、投資、返済など）を設定します。
                </p>
              </motion.div>

              <motion.div 
                className="bg-white rounded-lg p-6 shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">計画実行</h3>
                <p className="text-gray-600">
                  AIが最適な財務計画を提案。進捗をリアルタイムでトラッキング。
                </p>
              </motion.div>
            </div>

            <div className="mt-16 text-center">
              <Link 
                href="/demo" 
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
              >
                無料で体験する
              </Link>
            </div>
          </div>
        </section>

        {/* 体験談セクション */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">ユーザーの声</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                多くのユーザーがFinPlanXで財務目標を達成しています
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 rounded-lg p-6 shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="h-14 w-14 rounded-full overflow-hidden mr-4">
                      <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-gray-600 text-sm">{testimonial.position}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-20 bg-blue-600 text-white">
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
                  className="px-8 py-3 border border-white text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  デモを試す
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">F</span>
                </div>
                <h2 className="text-2xl font-bold">FinPlanX</h2>
              </div>
              <p className="text-gray-400">
                あなた専用の財務計画ツール。将来の資産形成をサポートします。
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">サービス</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">機能紹介</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">料金プラン</Link></li>
                <li><Link href="/demo" className="text-gray-400 hover:text-white transition-colors">デモ体験</Link></li>
                <li><Link href="/enterprise" className="text-gray-400 hover:text-white transition-colors">法人向けプラン</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">会社情報</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">会社概要</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">採用情報</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">ブログ</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">お問い合わせ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">リソース</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors">ヘルプセンター</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">よくある質問</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">プライバシーポリシー</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">利用規約</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} FinPlanX. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.039 10.039 0 01-3.113 1.191 4.92 4.92 0 00-8.384 4.482 13.98 13.98 0 01-10.15-5.147 4.92 4.92 0 001.522 6.564 4.92 4.92 0 01-2.229-.616c0 .015 0 .032 0 .049a4.917 4.917 0 003.95 4.82 4.927 4.927 0 01-2.222.084 4.94 4.94 0 004.604 3.426 9.88 9.88 0 01-6.11 2.106 9.942 9.942 0 01-1.173-.068 13.926 13.926 0 007.548 2.215c9.057 0 14.009-7.499 14.009-14.008 0-.214-.005-.428-.014-.639a9.936 9.936 0 002.438-2.557z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.92 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.92 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.92-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.92-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}