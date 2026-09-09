'use client';

import AuthPageSidePanel from '@/components/common/AuthPageSidePanel/AuthPageSidePanel';
import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Derives the tenant subdomain from the current hostname.
 * e.g. "acme.yourapp.com" -> "acme"; "acme.localhost" -> "acme"; bare domain -> ''.
 * Falls back to NEXT_PUBLIC_LOCAL_SUBDOMAIN on localhost so local dev can
 * simulate a tenant without needing a real subdomain.
 */
function getSubdomainFromHost(): string {
  let subdomain = process.env.NEXT_PUBLIC_LOCAL_SUBDOMAIN || '';

  if (typeof window === 'undefined') return subdomain;

  const hostname = window.location.hostname;

  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    const parts = hostname.split('.');
    if (parts.length > 2 || (parts.length === 2 && parts[1] === 'localhost')) {
      const extractedSubdomain = parts[0];
      if (extractedSubdomain && extractedSubdomain !== 'www') {
        subdomain = extractedSubdomain;
      }
    }
  }

  return subdomain;
}

export default function SigninPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const subdomain = getSubdomainFromHost();

    const result = await signIn('credentials', {
      phone: `+88${phone}`,
      password,
      subdomain,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error('Invalid phone or password. Please try again.');
    } else {
      toast.success('You have successfully logged in.');
      router.push('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    const subdomain = getSubdomainFromHost();

    // NextAuth's OAuth redirect can't carry custom fields on `account`, so we
    // stash the tenant in a short-lived cookie the `jwt` callback reads once
    // the user lands back after Google auth.
    if (subdomain) {
      document.cookie = `pending-tenant-subdomain=${subdomain}; path=/; max-age=300; samesite=lax`;
    }
    // else: no subdomain resolved (bare domain / no local override set), so
    // no cookie is set and the Google flow proceeds without a tenant.

    await signIn('google', { callbackUrl: '/' });

    setIsGoogleLoading(false);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_35%),linear-gradient(135deg,#f8fafc_0%,#eef4ff_50%,#f8fafc_100%)] p-4 dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_35%),linear-gradient(135deg,#020617_0%,#0b1220_50%,#020617_100%)]'>
      {/* Login Card */}
      <div className='grid w-full max-w-242.5 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.14)] lg:min-h-93.75 lg:grid-cols-[1.1fr_0.9fr] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'>
        {/* LEFT PANEL */}
        <AuthPageSidePanel />

        {/* RIGHT PANEL */}
        <div className='relative flex items-center justify-center p-6 sm:p-8 lg:p-9'>
          {/* Theme Toggle */}
          <div className='absolute top-4 right-4'>
            <ThemeToggle />
          </div>

          <div className='w-full max-w-90'>
            {/* Logo */}
            <div className='mb-2 flex items-center justify-center'>
              <Image
                src='/images/logo-white.png'
                alt='Sebagriho'
                width={400}
                height={150}
                className='h-12 w-40 rounded-xl dark:hidden'
                loading='eager'
              />
              <Image
                src='/images/logo-white.png'
                alt='Sebagriho'
                width={400}
                height={150}
                className='hidden h-12 w-40 rounded-xl dark:block'
                loading='eager'
              />
            </div>

            {/* Header */}
            <div className='mb-5'>
              <p className='text-primary text-[11px] font-semibold tracking-[0.3em] uppercase'>
                Sign in
              </p>

              <h2 className='mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
                Access your account
              </h2>
            </div>

            {/* Form */}
            <form className='space-y-4' onSubmit={handleSubmit}>
              {/* Phone */}
              <div className='space-y-1.5'>
                <label
                  htmlFor='phone'
                  className='text-xs font-medium text-slate-700 dark:text-slate-300'
                >
                  Phone Number
                </label>

                <div className='flex'>
                  <span className='bg-primary flex shrink-0 items-center rounded-l-lg border border-r-0 border-slate-300 px-3 text-xs font-medium text-white dark:border-slate-700'>
                    (+88) BD
                  </span>

                  <Input
                    id='phone'
                    type='tel'
                    inputMode='numeric'
                    placeholder='Enter phone number'
                    value={phone}
                    onChange={(e) => {
                      const digitsOnly = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 11);

                      setPhone(digitsOnly);
                    }}
                    className='h-10 rounded-l-none! border-slate-200 bg-slate-50 text-sm dark:border-slate-700 dark:bg-slate-800/60'
                  />
                </div>
              </div>

              {/* Password */}
              <div className='space-y-1.5'>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='text-xs font-medium text-slate-700 dark:text-slate-300'
                  >
                    Password
                  </label>

                  <Link
                    href='/auth/forgot-password'
                    className='text-primary text-xs font-medium hover:underline'
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='h-10 border-slate-200 bg-slate-50 pr-10 text-sm dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500'
                  />

                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='text-primary/70 hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition'
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign In */}
              <Button
                type='submit'
                disabled={isLoading || isGoogleLoading}
                className='bg-primary hover:bg-primary/85 mt-2 h-10 w-full rounded-lg text-sm font-medium text-white'
              >
                {isLoading ? <Loading className='text-white!' /> : 'Sign in'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
