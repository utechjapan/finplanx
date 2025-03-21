// app/debt-repayment/layout.tsx
import React from 'react';
import DashboardLayout from '@/src/components/layout/DashboardLayout';

export default function DebtRepaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}