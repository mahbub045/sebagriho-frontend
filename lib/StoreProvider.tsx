'use client';

import { makeStore, type AppStore } from '@/lib/store';
import type { Locale } from '@/lib/i18n/config';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { setAccessToken } from './features/auth/authSlice';
import { useAppDispatch } from './hooks';

function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAccessToken(session?.user?.accessToken ?? null));
  }, [session?.user?.accessToken, dispatch]);

  return children;
}

export default function StoreProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  // A fresh store per mount (not a module-level singleton), so server-side
  // state never leaks between requests/users. This is the standard Redux
  // Toolkit pattern for Next.js App Router:
  // https://redux-toolkit.js.org/usage/nextjs
  //
  // The locale is seeded into `preloadedState` here (store-creation time)
  // rather than synced via a post-mount effect, so both the server render
  // and the client's first render already agree with the cookie `getLocale()`
  // resolved — no flash of the default locale before an effect corrects it,
  // and nothing fights a locale change made client-side (e.g. via
  // `changeLocale`, which writes the cookie and does a full reload, so this
  // component simply remounts with a fresh store on the next locale).
  const [store] = useState<AppStore>(() =>
    makeStore({ locale: { locale } }),
  );

  return (
    <Provider store={store}>
      <AuthSync>{children}</AuthSync>
    </Provider>
  );
}
