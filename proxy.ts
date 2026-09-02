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

    if (path === '/' || path === '') {
      return NextResponse.redirect(new URL(getDashboardPath(), req.url));
    }

    const isClientPath =
      path === '/client' ||
      path.startsWith('/client/') ||
      path === '/client/dashboard' ||
      path.startsWith('/client/dashboard/');

    if (!isClientPath) {
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
