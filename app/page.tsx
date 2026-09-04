import { authOptions } from '@/lib/auth';
import { getDashboardPath } from '@/utils/redirectPath';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const organizationSlug = session.user.organization_slug;

  redirect(getDashboardPath(Boolean(session.user.is_admin), organizationSlug));
}
