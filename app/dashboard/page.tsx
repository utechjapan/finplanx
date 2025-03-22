'use client';

import React from 'react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-6">FinPlanX Dashboard</h1>
        <p className="mb-6">Welcome to your financial planning dashboard</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}