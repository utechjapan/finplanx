// app/debt-repayment/page.tsx
import { redirect } from 'next/navigation';

// Redirect from /debt-repayment to /dashboard/debt-repayment
export default function DebtRepaymentPage() {
  redirect('/dashboard/debt-repayment');
}