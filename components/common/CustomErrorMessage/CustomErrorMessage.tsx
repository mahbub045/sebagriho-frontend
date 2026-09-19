'use client';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface CustomErrorMessageProps {
  title: string;
}

const CustomErrorMessage: React.FC<CustomErrorMessageProps> = ({ title }) => {
  const { dict } = useTranslation();

  return (
    <div className='border-danger flex flex-col items-center justify-center gap-3 rounded-md border border-dashed py-12 text-center'>
      <div className='bg-danger/10 flex h-12 w-12 items-center justify-center rounded-full'>
        <AlertCircle className='text-danger h-6 w-6' />
      </div>
      <div className='space-y-1'>
        <p className='text-danger/80 text-sm font-medium'>
          {dict.errorState.failedToLoad.replace('{title}', title)}
        </p>
        <p className='text-muted-foreground text-sm'>
          {dict.errorState.fetchErrorDescription.replace('{title}', title)}
        </p>
      </div>
      <Button
        variant='default'
        size='sm'
        onClick={() => window.location.reload()}
        className='mt-1'
      >
        <RefreshCcw />
        {dict.errorState.retry}
      </Button>
    </div>
  );
};

export default CustomErrorMessage;
