// app/layout.tsx
import type { Metadata } from "next";
// Google Fontsの読み込みをコメントアウト
// import { Inter, Roboto_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// Google Fontsの設定をコメントアウト
// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-inter",
// });

// const roboto_mono = Roboto_Mono({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-roboto-mono",
// });

export const metadata: Metadata = {
  title: "FinPlanX - パーソナル財務計画",
  description: "あなた専用の収支計算・ライフプラン作成アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="ja" className={`${inter.variable} ${roboto_mono.variable}`}>
    <html lang="ja">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}