'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Plus } from 'lucide-react';
import Image from 'next/image';

import { LanguageSwitcher } from '../common/LanguageSwitcher/LanguageSwitcher';
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import Notification from './Notification/Notification';

const AppNavbar: React.FC = () => {
  return (
    <header className='bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur'>
      {/* Mobile Logo */}
      <div className='flex items-center lg:hidden'>
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

      {/* Desktop Sidebar Trigger */}
      <SidebarTrigger className='-ml-1 hidden shrink-0 lg:inline-flex' />

      <div className='flex flex-1 items-center justify-end gap-4'>
        <div className='flex items-center gap-2'>
          <LanguageSwitcher />

          <ThemeToggle />

          <Notification />

          <Button
            variant='default'
            size='sm'
            className='rounded-lg border border-gray-200 dark:border-gray-700'
          >
            <Plus />
            <span className='hidden sm:inline'>Join Our Referral Program</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
