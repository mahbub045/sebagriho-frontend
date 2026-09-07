'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function SigninPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    const callbackUrl = '/';

    try {
      const result = await signIn('credentials', {
        phone: `+88${phone}`,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError('Invalid phone number or password. Please try again.');
        setIsLoading(false);
        return;
      }

      window.location.href = result?.url ?? callbackUrl;
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);

    await signIn('google', { callbackUrl: '/' });

    setIsGoogleLoading(false);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_35%),linear-gradient(135deg,#f8fafc_0%,#eef4ff_50%,#f8fafc_100%)] p-4 dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_35%),linear-gradient(135deg,#020617_0%,#0b1220_50%,#020617_100%)]'>
      {/* Login Card */}
      <div className='grid w-full max-w-242.5 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.14)] lg:min-h-93.75 lg:grid-cols-[1.1fr_0.9fr] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'>
        {/* =====================================================
            LEFT PANEL
        ====================================================== */}
        <div className='relative hidden overflow-hidden p-7 text-white lg:flex lg:flex-col lg:justify-between'>
          {/* Background Image */}
          <div className='absolute inset-0 bg-[url("/images/banner.png")] bg-cover bg-center bg-no-repeat' />

          {/* Soft secondary tint */}
          <div className='bg-secondary/70 absolute inset-0' />

          {/* Soft color gradient */}
          <div className='from-primary to-secondary/50 absolute inset-0 bg-linear-to-br via-transparent' />

          {/* Content */}
          <div className='relative z-10'>
            {/* Logo */}
            {/* <div className='mb-8 flex items-center'>
              <Image
                src='/images/logo-white.png'
                alt='Sebagriho'
                width={400}
                height={150}
                className='h-12 w-auto object-contain'
                priority
              />
            </div> */}

            {/* Heading */}
            <div className='space-y-3'>
              <p className='text-[11px] font-semibold tracking-[0.3em] text-white/90 uppercase'>
                Welcome back
              </p>

              <h1 className='max-w-md text-3xl leading-[1.15] font-bold tracking-tight text-white drop-shadow-md'>
                Manage your operations from one place.
              </h1>
            </div>
          </div>

          {/* Bottom Information */}
          <div className='bg-secondary/20 relative z-10 rounded-2xl border border-white/25 px-4 py-3 backdrop-blur-sm'>
            <p className='text-xs leading-relaxed text-white'>
              Every customer interaction, every order, and every update in one
              centralized workspace.
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT PANEL
        ====================================================== */}
        <div className='relative flex items-center justify-center p-6 sm:p-8 lg:p-9'>
          {/* Theme Toggle */}
          <div className='absolute top-4 right-4'>
            <ThemeToggle />
          </div>

          <div className='w-full max-w-90'>
            {/* Mobile Logo */}
            <div className='mb-7 lg:hidden'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-sm font-bold text-white'>
                  S
                </div>

                <div>
                  <p className='text-base font-semibold text-slate-900 dark:text-slate-100'>
                    Sebagriho
                  </p>

                  <p className='text-[11px] text-slate-500 dark:text-slate-400'>
                    Business Portal
                  </p>
                </div>
              </div>
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
              {/* Error */}
              {error && (
                <div className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'>
                  {error}
                </div>
              )}

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
