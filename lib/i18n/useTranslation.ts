'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setLocale } from '@/lib/features/locale/localeSlice';
import type { Locale } from './config';
import { setLocaleCookie } from './actions';
import bn from './dictionaries/bn.json';
import en from './dictionaries/en.json';

const dictionaries: Record<Locale, typeof en> = { en, bn };

/**
 * Client-side counterpart to `getDictionary` (server). Use this in Client
 * Components; Server Components should call `getDictionary` directly instead.
 */
export function useTranslation() {
  const locale = useAppSelector((state) => state.locale.locale);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const changeLocale = useCallback(
    (next: Locale) => {
      dispatch(setLocale(next));
      startTransition(async () => {
        // Setting the cookie via a Server Action (rather than
        // `document.cookie`) invalidates Next.js's client-side Router Cache
        // for every route, not just the current one — so pages reached by
        // client-side navigation also re-render with the new locale instead
        // of showing stale, previously-cached content until individually
        // hard-refreshed.
        await setLocaleCookie(next);
        router.refresh();
      });
    },
    [dispatch, router],
  );

  return { locale, dict: dictionaries[locale], changeLocale };
}
