import React from 'react';
import DashboardLayout from '@/src/components/layout/DashboardLayout';

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}