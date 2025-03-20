// app/page.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">FinPlanX</h1>
          <nav>
            <Link 
              href="/login" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              ログイン
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">あなた専用の財務計画アプリ</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              収支管理、ライフプラン作成、借金返済計画、資産形成シミュレーションを一元管理
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                href="/login" 
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg"
              >
                はじめる
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-3 bg-white border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-lg"
              >
                詳細を見る
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">主な機能</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">収支管理</h3>
                <p className="text-gray-600">
                  月次・年次の収支計画と実績追跡。カテゴリ別支出分析と予算設定。
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">ライフプラン作成</h3>
                <p className="text-gray-600">
                  5年、10年、30年の人生イベントをシミュレーションし、財務影響を可視化。
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">借金返済計画</h3>
                <p className="text-gray-600">
                  複数の借金の一元管理と、効率的な返済戦略のシミュレーション。
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">資産形成シミュレーション</h3>
                <p className="text-gray-600">
                  投資ポートフォリオの作成・管理と長期的な資産成長予測。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold">FinPlanX</h2>
              <p className="text-gray-400">あなた専用の財務計画ツール</p>
            </div>
            <div>
              <p>&copy; {new Date().getFullYear()} FinPlanX. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}