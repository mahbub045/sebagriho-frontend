'use server';

import { cookies } from 'next/headers';
import { localeCookieName, type Locale } from './config';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

/**
 * Persists the chosen locale to a cookie via a Server Action (rather than
 * `document.cookie` on the client). Setting the cookie here invalidates
 * Next.js's client-side Router Cache for the whole app, so every route's
 * Server Components (breadcrumbs, page titles, etc. read via
 * `getDictionary`) re-render with the new locale on the next visit —
 * including ones reached by client-side navigation, not just the current
 * page. A client-only cookie write does not get this invalidation, which is
 * why previously only the page open at the time of the switch (via its own
 * `window.location.reload()`) picked up the new language, and every other
 * page kept showing the old one until it was individually hard-refreshed.
 */
export async function setLocaleCookie(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set(localeCookieName, locale, {
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
    sameSite: 'lax',
  });
}
