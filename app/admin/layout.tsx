import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '../../utils/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  // Protect admin panel: only allow specific email
  if (!user || user.email !== 'nurbekburkhanoff0@gmail.com') {
    redirect('/'); // Redirect unauthorized users to the homepage
  }

  return <>{children}</>;
}
