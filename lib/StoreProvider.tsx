'use client';

import { store } from '@/lib/store';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { setAccessToken } from './features/auth/authSlice';

function AuthSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    store.dispatch(setAccessToken(session?.user?.accessToken ?? null));
  }, [session?.user?.accessToken]);

  return children;
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthSync>{children}</AuthSync>
    </Provider>
  );
}
