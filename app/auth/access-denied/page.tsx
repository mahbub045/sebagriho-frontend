import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, ShieldX } from 'lucide-react';
import Link from 'next/link';

export default function AccessDeniedPage() {
  return (
    <main className='flex min-h-screen items-center justify-center px-6'>
      <div className='max-w-lg text-center'>
        <div className='bg-destructive/10 text-destructive mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
          <ShieldX className='h-10 w-10' />
        </div>
        <h1 className='text-3xl font-bold'>Access denied</h1>
        <p className='text-muted-foreground mt-3'>
          Your account is not assigned to an organization or does not have
          permission to view this page.
        </p>
        <div className='mt-8 flex justify-center gap-3'>
          <Button asChild>
            <Link href='/'>
              <Home />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant='outline'>
            <Link href='/auth/signin'>
              <ArrowLeft />
              Sign in again
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
