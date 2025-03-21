// app/investments/layout.tsx
import React from 'react';
import DashboardLayout from '@/src/components/layout/DashboardLayout';

export default function InvestmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}