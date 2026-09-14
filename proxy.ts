import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { getSubdomainFromHost } from './lib/getSubdomainFromHost';
import { getDashboardPath } from './utils/redirectPath';

const SESSION_COOKIE_NAME = 'next-auth.session-token';

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    const userToken = token as
      | {
          is_admin?: boolean;
          organization_type?: string;
          subdomain?: string | null;
        }
      | undefined;

    // The session cookie is shared across subdomains (see lib/auth.ts), so a
    // tenant user's session would otherwise still look "logged in" if they
    // land on a different tenant's subdomain. Force a logout instead.
    const currentSubdomain = getSubdomainFromHost(
      req.headers.get('host') ?? undefined,
    );
    if (
      userToken?.subdomain &&
      currentSubdomain &&
      userToken.subdomain !== currentSubdomain
    ) {
      const signinUrl = new URL('/auth/signin', req.url);
      signinUrl.searchParams.set('reason', 'subdomain-mismatch');

      const response = NextResponse.redirect(signinUrl);
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    const isAdmin = Boolean(userToken?.is_admin);
    if (path === '/' || path === '') {
      return NextResponse.redirect(
        new URL(
          getDashboardPath(isAdmin, userToken?.organization_type),
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

    const isOrganizationRoute =
      path === '/organization' || path.startsWith('/organization/');

    if (!isAdmin) {
      return isOrganizationRoute
        ? NextResponse.next()
        : NextResponse.redirect(
            new URL(
              getDashboardPath(false, userToken?.organization_type),
              req.url,
            ),
          );
    }

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
  matcher: ['/', '/super-admin/:path*', '/organization/:path*'],
};
