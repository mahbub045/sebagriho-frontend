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
    if (path === '/' || path === '') {
      return NextResponse.redirect(
        new URL(
          getDashboardPath(
            isAdmin,
            isAdmin
              ? undefined
              : (token as { organization_slug?: string } | undefined)
                  ?.organization_slug,
          ),
          req.url,
        ),
      );
    }

    const isAdminRoute =
      isAdmin && (path === '/super-admin' || path.startsWith('/super-admin/'));

    if (isAdmin) {
      return isAdminRoute
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/super-admin/dashboard', req.url));
    }

    const organizationSlug = (
      token as { organization_slug?: string } | undefined
    )?.organization_slug;
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
  matcher: [
    '/',
    '/super-admin/:path*',
    '/:organization_slug/dashboard',
    '/:organization_slug/dashboard/:path*',
  ],
};
