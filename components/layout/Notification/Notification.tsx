'use client';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Bell } from 'lucide-react';

export default function Notification() {
  const { dict } = useTranslation();

  return (
    <Button
      variant='ghost'
      size='icon-sm'
      className='border border-gray-200 dark:border-gray-700'
      aria-label={dict.notification.ariaLabel}
    >
      <Bell className='h-4 w-4' />
    </Button>
  );
}
