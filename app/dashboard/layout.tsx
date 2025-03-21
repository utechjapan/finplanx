// app/dashboard/layout.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import DashboardLayout from '@/src/components/layout/DashboardLayout';

// This layout wrapper provides the dashboard shell for all pages
export default async function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for authentication on the server side
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to login
  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}