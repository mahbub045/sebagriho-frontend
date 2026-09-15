import { authOptions } from '@/lib/auth';
import { getDashboardPath } from '@/utils/redirectPath';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  if (!session.user.is_password_set) {
    redirect('/auth/set-password');
  }

  redirect(getDashboardPath(Boolean(session.user.is_admin)));
}
