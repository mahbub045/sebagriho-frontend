import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  // Support subdomains sharing the same session cookie, e.g. tenant.example.com
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
      },
    },
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          scope: 'openid email profile',
        },
      },
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
        subdomain: { label: 'Subdomain', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: 'POST',
            body: JSON.stringify({
              phone: credentials.phone,
              password: credentials.password,
            }),
            headers: {
              'Content-Type': 'application/json',
              'X-ORGANIZATION-SUBDOMAIN': credentials.subdomain || '',
            },
          },
        );

        if (!res.ok) return null;

        const { access, refresh } = await res.json();

        if (!access) return null;

        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${access}`,
              'Content-Type': 'application/json',
              'X-ORGANIZATION-SUBDOMAIN': credentials.subdomain || '',
            },
          },
        );

        if (!profileRes.ok) return null;

        const profile = await profileRes.json();

        return {
          id: profile.id,
          phone: profile.phone,
          is_admin: profile.is_admin,
          organization_type: profile.organization_type,
          subdomain: credentials.subdomain || null,
          is_password_set: profile.is_password_set,
          accessToken: access,
          refreshToken: refresh,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // ✅ Called by SessionSync → update() after token refresh in baseApi,
      // or by the set-password page right after the password is set.
      if (trigger === 'update' && session) {
        if (session.accessToken) {
          token.accessToken = session.accessToken;
          token.refreshToken = session.refreshToken;
        }
        if (session.subdomain !== undefined) {
          token.subdomain = session.subdomain;
        }
        if (session.is_password_set !== undefined) {
          token.is_password_set = session.is_password_set;
        }
        return token;
      }

      // ✅ Google sign-in flow
      if (account?.provider === 'google' && account.access_token) {
        // Google doesn't carry a tenant subdomain on its own; if you collect
        // one before redirecting to Google (e.g. via a query param captured
        // on the sign-in page and passed through `state` or a cookie), read
        // it here instead of leaving it undefined.
        const subdomain = (account as { subdomain?: string }).subdomain || '';

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/social/google`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-ORGANIZATION-SUBDOMAIN': subdomain,
              },
              body: JSON.stringify({
                access_token: account.access_token,
              }),
            },
          );

          if (res.ok) {
            const { access, refresh } = await res.json();

            const profileRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
              {
                headers: {
                  Authorization: `Bearer ${access}`,
                  'Content-Type': 'application/json',
                  'X-ORGANIZATION-SUBDOMAIN': subdomain,
                },
              },
            );

            if (profileRes.ok) {
              const profile = await profileRes.json();
              token.id = profile.id;
              token.phone = profile.phone;
              token.is_admin = profile.is_admin;
              token.organization_type = profile.organization_type;
              token.subdomain = subdomain || null;
              token.is_password_set = profile.is_password_set;
              token.accessToken = access;
              token.refreshToken = refresh;
            }
          } else {
            console.error('Backend Google auth failed:', await res.text());
          }
        } catch (error) {
          console.error('Google auth backend error:', error);
        }

        return token;
      }

      // ✅ Credentials sign-in flow
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.is_admin = user.is_admin;
        token.organization_type = user.organization_type;
        token.subdomain = user.subdomain ?? null;
        token.is_password_set = user.is_password_set;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.phone = token.phone || '';
      session.user.is_admin = token.is_admin;
      session.user.organization_type = token.organization_type;
      session.user.subdomain = token.subdomain ?? null;
      session.user.is_password_set = token.is_password_set;
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
  },

  session: {
    strategy: 'jwt',
    maxAge: 12 * 60 * 60, // 12 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};
