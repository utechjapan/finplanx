// app/finances/page.tsx
import { redirect } from 'next/navigation';

// Redirect from /finances to /dashboard/finances
export default function FinancesPage() {
  redirect('/dashboard/finances');
}