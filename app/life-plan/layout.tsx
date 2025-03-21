// app/life-plan/layout.tsx
import React from 'react';
import DashboardLayout from '@/src/components/layout/DashboardLayout';

export default function LifePlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}