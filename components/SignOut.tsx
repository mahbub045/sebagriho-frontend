import { getSession, signOut } from 'next-auth/react';

export const handleSignOut = async (
  signOutOptions: Parameters<typeof signOut>[0] = {
    callbackUrl: '/auth/signin',
  },
) => {
  try {
    let accessToken: string | null = null;
    let refreshToken: string | null = null;

    if (typeof window !== 'undefined') {
      accessToken = localStorage.getItem('accessToken');
      refreshToken = localStorage.getItem('refreshToken');
    }

    // Fallback to session if localStorage is empty
    if (!accessToken || !refreshToken) {
      const session = await getSession();
      accessToken = accessToken || session?.user?.accessToken || null;
      refreshToken = refreshToken || session?.user?.refreshToken || null;
    }

    // Call logout API to invalidate token server-side
    if (accessToken && refreshToken) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken, // ✅ matches your API body
        }),
      }).catch((error) => {
        console.error('Logout API call failed:', error);
        // Don't block logout if API call fails
      });
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Always clear all local/client-side data regardless of API result
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      clearAllCookies();
      await clearAllCaches();
    }

    await signOut(signOutOptions);
  }
};

const clearAllCookies = () => {
  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim();
    if (!name) return;

    // Clear for current path and root path, with and without domain,
    // to cover cookies set at different path/domain scopes.
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${window.location.pathname}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
  });
};

const clearAllCaches = async () => {
  if (typeof caches === 'undefined') return;

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
  } catch (error) {
    console.error('Failed to clear cache storage:', error);
  }
};
