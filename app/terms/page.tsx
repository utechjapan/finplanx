// app/terms/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';

export default function TermsOfServicePage() {
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
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">利用規約</h1>
            
            <div className="prose prose-blue max-w-none dark:prose-invert">
              <p className="text-gray-700 dark:text-gray-300">
                この利用規約（以下、「本規約」）は、FinPlanX（以下、「当サービス」）の利用条件を定めるものです。
                ユーザーの皆様（以下、「ユーザー」）には、本規約に同意いただいた上で、当サービスをご利用いただきます。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">1. 適用</h2>
              <p className="text-gray-700 dark:text-gray-300">
                本規約は、ユーザーと当サービスの間の当サービスの利用に関わる一切の関係に適用されるものとします。
                当サービスは、ユーザーに事前に通知することなく、本規約を変更することがあります。
                変更後の規約は、当サービス上に表示した時点で効力を生じるものとします。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">2. 利用登録</h2>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスの利用を希望する者は、当サービスの定める方法によって利用登録を申請し、
                当サービスがこれを承認することによって、利用登録が完了するものとします。
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                当サービスは、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあります：
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
                <li>申請内容に虚偽、誤記または記載漏れがあった場合</li>
                <li>申請者が過去に本規約に違反したことがある場合</li>
                <li>その他、当サービスが利用登録を適当でないと判断した場合</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">3. ユーザーIDおよびパスワードの管理</h2>
              <p className="text-gray-700 dark:text-gray-300">
                ユーザーは、自己の責任において、当サービスのユーザーIDおよびパスワードを管理するものとします。
                ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与することはできません。
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                当サービスは、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、
                そのユーザーIDを登録しているユーザー自身による利用とみなします。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">4. 禁止事項</h2>
              <p className="text-gray-700 dark:text-gray-300">
                ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません：
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>当サービスのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                <li>当サービスの運営を妨害するおそれのある行為</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>他のユーザーに成りすます行為</li>
                <li>当サービスが許可しない方法での宣伝、広告、勧誘、または営業行為</li>
                <li>当サービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                <li>その他、当サービスが不適切と判断する行為</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">5. 当サービスの提供の停止等</h2>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく当サービスの全部または一部の提供を停止または中断することができるものとします：
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 dark:text-gray-300">
                <li>当サービスのシステムの保守点検または更新を行う場合</li>
                <li>地震、落雷、火災、停電または天災などの不可抗力により、当サービスの提供が困難となった場合</li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、当サービスが停止または中断を必要と判断した場合</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスは、当サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害について、理由を問わず一切の責任を負わないものとします。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">6. 免責事項</h2>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスは、当サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                当サービスは、当サービスに表示される財務計算結果や財務アドバイスについて、その正確性、完全性、有用性を保証するものではありません。
                ユーザーは、自己の責任と判断において当サービスを利用し、必要に応じて専門家に相談することを推奨します。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">7. サービス内容の変更等</h2>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスは、ユーザーに通知することなく、当サービスの内容を変更しまたは当サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">8. 利用規約の変更</h2>
              <p className="text-gray-700 dark:text-gray-300">
                当サービスは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。
                変更後の利用規約は、当サービス上に表示した時点で効力を生じるものとします。
              </p>

              <h2 className="text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-white">9. 準拠法と管轄裁判所</h2>
              <p className="text-gray-700 dark:text-gray-300">
                本規約の解釈にあたっては、日本法を準拠法とします。
                当サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
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