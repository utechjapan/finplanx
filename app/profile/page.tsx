// app/profile/page.tsx
import { redirect } from 'next/navigation';

// Redirect from /profile to /dashboard/profile
export default function ProfilePage() {
  redirect('/dashboard/profile');
}