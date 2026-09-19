'use client';

import AuthPageSidePanel from '@/components/common/AuthPageSidePanel/AuthPageSidePanel';
import Loading from '@/components/common/CustomLoader/Loading';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher/LanguageSwitcher';
import { handleSignOut } from '@/components/SignOut';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
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

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { dict } = useTranslation();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const hasHandledSubdomainMismatch = useRef(false);

  useEffect(() => {
    if (
      searchParams.get('reason') === 'subdomain-mismatch' &&
      !hasHandledSubdomainMismatch.current
    ) {
      // Guard against React Strict Mode's double-invoke (and any other
      // re-run of this effect) firing the sign-out + redirect below twice
      // concurrently — two overlapping client-side navigations to the same
      // route can otherwise corrupt the RSC stream on the second resolution.
      hasHandledSubdomainMismatch.current = true;
      toast.error(dict.authPages.signIn.subdomainForcedSignout);
      // The middleware already dropped the session cookie server-side, but we
      // still run the real sign-out flow (backend token invalidation, local
      // storage cleanup, next-auth signOut) so client state is fully reset.
      // `redirect: false` avoids next-auth's own hard navigation back to this
      // same page (which caused a second, jarring reload) — we just clean up
      // the query param ourselves once it's done.
      handleSignOut({ redirect: false }).then(() => {
        router.replace('/auth/signin');
      });
    }
  }, [searchParams, router, dict.authPages.signIn.subdomainForcedSignout]);

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
      toast.error(dict.authPages.signIn.invalidCredentials);
    } else {
      toast.success(dict.authPages.signIn.loginSuccess);
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
          {/* Theme Toggle & Language Switcher */}
          <div className='absolute top-4 right-4 flex items-center gap-2'>
            <LanguageSwitcher />
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
                {dict.authPages.signIn.eyebrow}
              </p>

              <h2 className='mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
                {dict.authPages.signIn.heading}
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
                  {dict.authPages.signIn.phoneNumber}
                </label>

                <div className='flex'>
                  <span className='bg-primary flex shrink-0 items-center rounded-l-lg border border-r-0 border-slate-300 px-3 text-xs font-medium text-white dark:border-slate-700'>
                    {dict.authPages.signIn.countryCode}
                  </span>

                  <Input
                    id='phone'
                    type='tel'
                    inputMode='numeric'
                    placeholder={dict.authPages.signIn.phonePlaceholder}
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
                    {dict.authPages.signIn.password}
                  </label>

                  <Link
                    href='/auth/forgot-password'
                    className='text-primary text-xs font-medium hover:underline'
                  >
                    {dict.authPages.signIn.forgotPassword}
                  </Link>
                </div>

                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder={dict.authPages.signIn.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='h-10 border-slate-200 bg-slate-50 pr-10 text-sm dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500'
                  />

                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='text-primary/70 hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition'
                    aria-label={
                      showPassword
                        ? dict.authPages.signIn.hidePassword
                        : dict.authPages.signIn.showPassword
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
                {isLoading ? (
                  <Loading className='text-white!' />
                ) : (
                  dict.authPages.signIn.submitButton
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SigninPage() {
  return (
    <Suspense fallback={null}>
      <SigninForm />
    </Suspense>
  );
}
