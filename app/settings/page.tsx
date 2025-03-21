// app/settings/page.tsx
import { redirect } from 'next/navigation';

// Redirect from /settings to /dashboard/settings
export default function SettingsPage() {
  redirect('/dashboard/settings');
}