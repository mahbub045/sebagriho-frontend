'use client';
import { handleSignOut } from '@/components/SignOut';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LogOut, ShieldX } from 'lucide-react';

export default function AccessDeniedPage() {
  const { dict } = useTranslation();

  return (
    <main className='bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-6'>
      {/* Decorative background glows */}
      <div className='bg-primary/10 absolute top-20 left-20 h-72 w-72 rounded-full blur-3xl' />
      <div className='bg-secondary/10 absolute right-20 bottom-20 h-72 w-72 rounded-full blur-3xl' />

      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div
          className='h-full w-full'
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, currentColor 2px, transparent 0)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className='relative w-full max-w-md text-center'>
        {/* Icon */}
        <div className='bg-destructive/10 text-destructive ring-destructive/20 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ring-1'>
          <ShieldX className='h-10 w-10' />
        </div>

        {/* Heading */}
        <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
          {dict.authPages.accessDenied.title}
        </h1>

        {/* Description */}
        <p className='text-muted-foreground mt-3 text-sm sm:text-base'>
          {dict.authPages.accessDenied.description}
        </p>

        {/* Secondary / recovery actions */}
        <div className='mt-6 border-t pt-6'>
          <p className='text-muted-foreground text-xs'>
            {dict.authPages.accessDenied.wrongAccount}
          </p>
          <div className='mt-3 flex items-center justify-center gap-2'>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => {
                handleSignOut();
              }}
            >
              <LogOut className='size-3.5' />
              {dict.authPages.accessDenied.signOutButton}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
