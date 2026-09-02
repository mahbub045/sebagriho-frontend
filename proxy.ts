import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getDashboardPath } from './utils/redirectPath';

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    const isAdmin = Boolean(
      (token as { is_admin?: boolean } | undefined)?.is_admin,
    );
    const organizationSlug = (
      token as { organization_slug?: string } | undefined
    )?.organization_slug;

    if (path === '/' || path === '') {
      return NextResponse.redirect(
        new URL(getDashboardPath(isAdmin, organizationSlug), req.url),
      );
    }

    const isAdminRoute =
      isAdmin && (path === '/super-admin' || path.startsWith('/super-admin/'));

    const isOrganizationRoute =
      Boolean(organizationSlug) &&
      (path === `/${organizationSlug}` ||
        path === `/${organizationSlug}/` ||
        path.startsWith(`/${organizationSlug}/`));

    if (!isAdminRoute && !isOrganizationRoute) {
      return NextResponse.redirect(new URL('/auth/access-denied', req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/signin',
    },
  },
);

export const config = {
  matcher: ['/', '/client/:path*'],
};
