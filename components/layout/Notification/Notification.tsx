import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export default function Notification() {
  return (
    <Button
      variant='ghost'
      size='icon-sm'
      className='border border-gray-200 dark:border-gray-700'
      aria-label='Notifications'
    >
      <Bell className='h-4 w-4' />
    </Button>
  );
}
