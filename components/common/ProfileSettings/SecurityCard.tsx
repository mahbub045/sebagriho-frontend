'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  isPasswordSet: boolean;
};

const SecurityCard: React.FC<Props> = ({ isPasswordSet }) => {
  const handleClick = () => {
    toast.info('Password management is coming soon');
  };

  return (
    <Card className='border-border/60 items-center p-5 text-center shadow-sm'>
      <div className='bg-destructive/10 flex h-14 w-14 items-center justify-center rounded-full'>
        <ShieldCheck className='text-destructive h-5 w-5' />
      </div>

      <h3 className='text-sm font-semibold'>Security</h3>
      <p className='text-muted-foreground text-xs leading-5'>
        Keep your account secure by updating your password regularly. Use a mix
        of letters, numbers, and symbols, and avoid reusing passwords from other
        sites.
      </p>

      <Button
        variant='destructive'
        className='mt-4 w-full'
        onClick={handleClick}
      >
        <KeyRound />
        {isPasswordSet ? 'Change Password' : 'Reset Password'}
      </Button>
    </Card>
  );
};

export default SecurityCard;
