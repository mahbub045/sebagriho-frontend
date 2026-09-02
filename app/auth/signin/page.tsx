'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SigninPage: React.FC = () => {
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
              <p className='text-sm font-medium uppercase tracking-[0.25em] text-slate-400'>
                Welcome back
              </p>
              <h1 className='max-w-sm text-4xl font-bold leading-tight'>
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
              <p className='text-sm font-medium uppercase tracking-[0.25em] text-blue-600'>
                Sign in
              </p>
              <h2 className='mt-3 text-3xl font-bold tracking-tight text-slate-900'>
                Access your account
              </h2>
            </div>

            <form className='space-y-5'>
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
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  className='h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-base text-slate-900 shadow-sm transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100'
                />
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

              <Button className='h-12 w-full rounded-xl bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500'>
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
