'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import ResetPasswordDialog from './Dialogs/ResetPasswordDialog';

const SecurityCard: React.FC = () => {
  const { dict } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className='border-border/60 items-center p-5 text-center shadow-sm'>
      <div className='bg-destructive/10 flex h-14 w-14 items-center justify-center rounded-full'>
        <ShieldCheck className='text-destructive h-5 w-5' />
      </div>

      <h3 className='text-sm font-semibold'>
        {dict.profileSettings.security.title}
      </h3>
      <p className='text-muted-foreground text-xs leading-5'>
        {dict.profileSettings.security.description}
      </p>

      <Button
        variant='destructive'
        className='mt-4 w-full'
        onClick={() => setIsDialogOpen(true)}
      >
        <KeyRound />
        {dict.profileSettings.security.resetPassword}
      </Button>

      <ResetPasswordDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Card>
  );
};

export default SecurityCard;
