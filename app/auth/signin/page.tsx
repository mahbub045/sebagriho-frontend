'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const SigninPage: React.FC = () => {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn('credentials', {
      phone,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      toast.error('Invalid email or password. Please try again.');
    } else {
      toast.success('You have successfully logged in.');
      router.push('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/' });
    setIsGoogleLoading(false);
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_35%),linear-gradient(135deg,#f8fafc_0%,#eef4ff_45%,#f8fafc_100%)] p-4'>
      <div className='grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-md lg:grid-cols-[1.1fr_0.9fr]'>
        <div className='hidden flex-col justify-between bg-slate-950 p-8 text-white lg:flex'>
          <div>
            <div className='mb-10 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-bold text-white'>
                S
              </div>
              <div>
                <p className='text-lg font-semibold'>Sebagriho</p>
                <p className='text-xs text-slate-300'>Business Portal</p>
              </div>
            </div>

            <div className='space-y-5'>
              <p className='text-sm font-medium tracking-[0.25em] text-slate-400 uppercase'>
                Welcome back
              </p>
              <h1 className='max-w-sm text-4xl leading-tight font-bold'>
                Manage your operations from one place.
              </h1>
            </div>
          </div>

          <div className='rounded-2xl border border-white/10 bg-white/5 p-5'>
            <p className='text-sm text-slate-300'>
              “Every customer interaction, every order, and every update in one
              centralized workspace.”
            </p>
          </div>
        </div>

        <div className='flex items-center justify-center p-6 sm:p-8 lg:p-10'>
          <div className='w-full max-w-md'>
            <div className='mb-8 lg:hidden'>
              <div className='mb-4 flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-bold text-white'>
                  S
                </div>
                <div>
                  <p className='text-lg font-semibold text-slate-900'>
                    Sebagriho
                  </p>
                  <p className='text-xs text-slate-500'>Business Portal</p>
                </div>
              </div>
            </div>

            <div className='mb-6'>
              <p className='text-sm font-medium tracking-[0.25em] text-blue-600 uppercase'>
                Sign in
              </p>
              <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900'>
                Access your account
              </h2>
            </div>

            <form className='space-y-5' onSubmit={handleSubmit}>
              <div className='space-y-2'>
                <label
                  htmlFor='phone'
                  className='text-sm font-medium text-slate-700'
                >
                  Phone Number
                </label>
                <Input
                  id='phone'
                  type='tel'
                  placeholder='e.g. +234 812 345 6789'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className='h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-base text-slate-900 shadow-sm transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='text-sm font-medium text-slate-700'
                  >
                    Password
                  </label>
                  <button
                    type='button'
                    className='text-sm font-medium text-blue-600 transition hover:text-blue-500'
                  >
                    Forgot password?
                  </button>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='h-12 rounded-xl border-slate-200 bg-slate-50 px-4 pr-11 text-base text-slate-900 shadow-sm transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                  />

                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 transition hover:text-slate-600'
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5' />
                    ) : (
                      <Eye className='h-5 w-5' />
                    )}
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between gap-3 pt-1'>
                <label className='flex items-center gap-2 text-sm text-slate-600'>
                  <input
                    type='checkbox'
                    className='h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500'
                  />
                  Remember me
                </label>
              </div>

              <Button
                type='submit'
                disabled={isLoading || isGoogleLoading}
                className='bg-primary hover:bg-primary/80 mt-2 h-11 w-full font-medium text-white'
              >
                {isLoading && <Loading className='text-white!' />}
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
