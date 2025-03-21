import React from 'react';
import DashboardLayout from '@/src/components/layout/DashboardLayout';

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}