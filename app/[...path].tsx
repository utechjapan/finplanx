// app/[...path].tsx - Create this file to handle redirects
import { redirect } from 'next/navigation';

export default function CatchAllRoute({ params }: { params: { path: string[] } }) {
  // Redirect to the dashboard equivalent
  redirect(`/dashboard/${params.path.join('/')}`);
}