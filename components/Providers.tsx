'use client';

import StoreProvider from '@/lib/StoreProvider';
import type { Locale } from '@/lib/i18n/config';
import { SessionProvider } from 'next-auth/react';

export default function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return (
    <SessionProvider>
      <StoreProvider locale={locale}>{children}</StoreProvider>
    </SessionProvider>
  );
}
