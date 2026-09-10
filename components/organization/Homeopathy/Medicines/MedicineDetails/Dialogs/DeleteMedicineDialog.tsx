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
} from '@/components/ui/dialog';
import { useDeleteMedicineMutation } from '@/lib/services/endpoints/organization/Homeopathy/Medicines/MedicinesApi';
import { DeleteMedicineDialogProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const DeleteMedicineDialog: React.FC<DeleteMedicineDialogProps> = ({
  isOpen,
  onClose,
  medicineUid,
  medicineName,
}) => {
  const router = useRouter();
  const [deleteMedicine, { isLoading }] = useDeleteMedicineMutation();
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    try {
      setErrorMessage('');

      await deleteMedicine({
        medicineUid: medicineUid,
      }).unwrap();
      toast.success('Medicine deleted successfully');
      onClose();
      router.back();
    } catch (error) {
      console.error('Failed to delete medicine:', error);
      toast.error('Failed to delete medicine. Please try again.');
      setErrorMessage('Failed to delete medicine. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='bg-danger/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full sm:mx-0'>
            <ShieldAlert className='text-danger h-6 w-6' />
          </div>

          <DialogTitle className='mt-3 text-center sm:text-left'>
            Delete {medicineName}?
          </DialogTitle>

          <DialogDescription className='text-center sm:text-left'>
            This action is permanent and can&apos;t be reversed.
          </DialogDescription>
        </DialogHeader>

        <div className='border-danger/20 bg-danger/5 rounded-lg border p-3'>
          <p className='text-sm font-medium'>Deleting this medicine will:</p>

          <ul className='text-muted-foreground mt-2 space-y-1.5 text-sm'>
            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              Permanently remove the medicine record
            </li>

            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              Remove associated files and information
            </li>

            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              This action cannot be undone
            </li>
          </ul>
        </div>

        {errorMessage && (
          <div className='border-danger/20 bg-danger/5 text-danger rounded-lg border p-3 text-sm'>
            {errorMessage}
          </div>
        )}

        <DialogFooter className='mt-2'>
          <Button variant='outline' disabled={isLoading} asChild>
            <DialogClose>Cancel</DialogClose>
          </Button>

          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loading className='text-danger! h-4 w-4' />}

            {isLoading ? 'Deleting...' : 'Yes, delete medicine'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMedicineDialog;
