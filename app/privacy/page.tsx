// app/privacy/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';

export default function PrivacyPolicyPage() {
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
            className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
          >
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">プライバシーポリシー</h1>
            
            <div className="prose prose-blue max-w-none dark:prose-invert">
              <p className="text-gray-700 dark:text-gray-300">
                FinPlanX（以下、「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
                本プライバシーポリシーでは、当サービスが収集する情報とその利用方法について説明します。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">1. 収集する情報</h2>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスでは、以下の情報を収集することがあります：
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
                <li>アカウント作成時に提供される情報（名前、メールアドレスなど）</li>
                <li>財務計画作成のために入力される情報（収入、支出、貯蓄目標など）</li>
                <li>サービス利用に関するデータ（ログ情報、利用状況など）</li>
                <li>デバイス情報（IPアドレス、ブラウザタイプなど）</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">2. 情報の利用目的</h2>
              <p className="text-gray-700 dark:text-gray-300">
                収集した情報は、以下の目的で利用されます：
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
                <li>サービスの提供および運営</li>
                <li>ユーザーアカウントの管理</li>
                <li>サービスの改善および新機能の開発</li>
                <li>ユーザーサポートの提供</li>
                <li>不正行為の防止およびセキュリティの確保</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">3. 情報の共有</h2>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスは、以下の場合を除き、ユーザーの個人情報を第三者と共有することはありません：
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
                <li>ユーザーの同意がある場合</li>
                <li>法律上の要請や規制に従う必要がある場合</li>
                <li>当サービスの利用規約を執行するため</li>
                <li>当サービスや他のユーザーの権利、財産、安全を保護するため</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">4. データの保管</h2>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスは、ユーザーの個人情報をサービス提供に必要な期間のみ保持します。アカウントが削除された場合、
                対応するユーザーデータは合理的な期間内に削除されます。ただし、法的義務の遵守や紛争解決のために
                一部の情報を保持することがあります。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">5. データのセキュリティ</h2>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスは、ユーザーの個人情報を保護するために適切なセキュリティ対策を講じています。
                ただし、インターネットやデータストレージシステムの性質上、100%の安全性を保証することはできません。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">6. Cookieの使用</h2>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスでは、ユーザー体験の向上、サービスの改善、および分析のためにCookieを使用しています。
                ユーザーはブラウザの設定によりCookieの使用を制限することができますが、一部の機能が正常に動作しなくなる
                可能性があります。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">7. ユーザーの権利</h2>
              <p className="text-gray-700 dark:text-gray-300">
                ユーザーには以下の権利があります：
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
                <li>個人情報へのアクセスや修正を要求する権利</li>
                <li>個人情報の削除を要求する権利</li>
                <li>個人情報の処理に対して異議を唱える権利</li>
                <li>個人情報の可搬性を要求する権利</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                これらの権利を行使するには、以下の連絡先までご連絡ください。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">8. プライバシーポリシーの変更</h2>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスは、必要に応じて本プライバシーポリシーを変更することがあります。
                重要な変更がある場合は、サービス内で通知するか、登録されているメールアドレスに通知します。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">9. お問い合わせ</h2>
              <p className="text-gray-700 dark:text-gray-300">
                本プライバシーポリシーに関するご質問やご懸念がある場合は、以下の連絡先までお問い合わせください：
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Email: contact@finplanx-app.com
              </p>

              <p className="text-gray-700 dark:text-gray-300 mt-8">
                最終更新日: 2025年3月21日
              </p>
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