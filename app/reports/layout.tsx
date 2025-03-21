// app/reports/layout.tsx
import React from 'react';
import DashboardLayout from '@/src/components/layout/DashboardLayout';

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}