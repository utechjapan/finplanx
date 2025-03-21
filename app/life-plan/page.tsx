// app/life-plan/page.tsx
import { redirect } from 'next/navigation';

// Redirect from /life-plan to /dashboard/life-plan
export default function LifePlanPage() {
  redirect('/dashboard/life-plan');
}