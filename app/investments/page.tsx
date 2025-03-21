// app/investments/page.tsx
import { redirect } from 'next/navigation';

// Redirect from /investments to /dashboard/investments
export default function InvestmentsPage() {
  redirect('/dashboard/investments');
}