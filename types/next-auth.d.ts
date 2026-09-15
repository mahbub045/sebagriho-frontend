import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    phone: string;
    is_admin: boolean;
    organization_type?: string;
    subdomain?: string | null;
    is_password_set: boolean;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: {
      id: string;
      phone: string;
      is_admin: boolean;
      organization_type?: string;
      subdomain?: string | null;
      is_password_set: boolean;
      accessToken: string;
      refreshToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    phone: string;
    is_admin: boolean;
    organization_type?: string;
    subdomain?: string | null;
    is_password_set: boolean;
    accessToken: string;
    refreshToken: string;
  }
}
