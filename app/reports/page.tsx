// app/reports/page.tsx
import { redirect } from 'next/navigation';

// Redirect from /reports to /dashboard/reports
export default function ReportsPage() {
  redirect('/dashboard/reports');
}