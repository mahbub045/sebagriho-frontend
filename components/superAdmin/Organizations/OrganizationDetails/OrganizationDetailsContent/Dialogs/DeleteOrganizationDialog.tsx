'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeleteOrganizationMutation } from '@/lib/services/endpoints/superAdmin/Organizations/OrganizationsApi';
import { ShieldAlert, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  organizationUid: string;
  organizationName: string;
};

const DeleteOrganizationDialog: React.FC<Props> = ({
  organizationUid,
  organizationName,
}) => {
  const router = useRouter();
  const [deleteOrganization, { isLoading }] = useDeleteOrganizationMutation();
  const [open, setOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const isConfirmed = confirmationText === organizationName;

  const handleDelete = async () => {
    if (!isConfirmed) return;
    try {
      await deleteOrganization({ organizationUid }).unwrap();
      setOpen(false);
      router.push('/super-admin/organizations');
    } catch (error) {
      console.error('Failed to delete organization:', error);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setConfirmationText('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button variant='destructive' className='shrink-0' asChild>
        <DialogTrigger>
          <Trash2 className='h-4 w-4' />
          Delete organization
        </DialogTrigger>
      </Button>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='bg-danger/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full sm:mx-0'>
            <ShieldAlert className='text-danger h-6 w-6' />
          </div>
          <DialogTitle className='mt-3 text-center sm:text-left'>
            Delete {organizationName}?
          </DialogTitle>
          <DialogDescription className='text-center sm:text-left'>
            This action is permanent and can&apos;t be reversed.
          </DialogDescription>
        </DialogHeader>

        <div className='border-danger/20 bg-danger/5 rounded-lg border p-3'>
          <p className='text-sm font-medium'>
            Deleting this organization will:
          </p>
          <ul className='text-muted-foreground mt-2 space-y-1.5 text-sm'>
            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              Remove all organization data and settings
            </li>
            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              Delete the owner account tied to this organization
            </li>
            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              Revoke access for anyone currently using it
            </li>
          </ul>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='confirm-organization-name' className='text-sm'>
            Please type{' '}
            <span className='text-danger font-semibold'>
              {organizationName}
            </span>{' '}
            to confirm.
          </Label>
          <Input
            type='text'
            id='confirm-organization-name'
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            disabled={isLoading}
            autoComplete='off'
            autoFocus
          />
        </div>

        <DialogFooter className='mt-2'>
          <Button variant='outline' disabled={isLoading} asChild>
            <DialogClose>Cancel</DialogClose>
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading || !isConfirmed}
          >
            {isLoading && <Loading className='text-danger! h-4 w-4' />}
            {isLoading ? 'Deleting...' : 'Yes, delete organization'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOrganizationDialog;
