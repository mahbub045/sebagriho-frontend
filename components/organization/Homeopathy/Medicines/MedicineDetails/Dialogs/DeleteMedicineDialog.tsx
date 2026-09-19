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
import { useTranslation } from '@/lib/i18n/useTranslation';
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
  const { dict } = useTranslation();
  const router = useRouter();
  const [deleteMedicine, { isLoading }] = useDeleteMedicineMutation();
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    try {
      setErrorMessage('');

      await deleteMedicine({
        medicineUid: medicineUid,
      }).unwrap();
      toast.success(dict.medicines.dialogs.deleteMedicine.successToast);
      onClose();
      router.back();
    } catch (error) {
      console.error('Failed to delete medicine:', error);
      toast.error(dict.medicines.dialogs.deleteMedicine.errorToast);
      setErrorMessage(dict.medicines.dialogs.deleteMedicine.errorToast);
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
            {dict.medicines.dialogs.deleteMedicine.title.replace(
              '{medicineName}',
              medicineName ?? '',
            )}
          </DialogTitle>

          <DialogDescription className='text-center sm:text-left'>
            {dict.medicines.dialogs.deleteMedicine.description}
          </DialogDescription>
        </DialogHeader>

        <div className='border-danger/20 bg-danger/5 rounded-lg border p-3'>
          <p className='text-sm font-medium'>
            {dict.medicines.dialogs.deleteMedicine.willTitle}
          </p>

          <ul className='text-muted-foreground mt-2 space-y-1.5 text-sm'>
            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              {dict.medicines.dialogs.deleteMedicine.willRemoveRecord}
            </li>

            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              {dict.medicines.dialogs.deleteMedicine.willRemoveFiles}
            </li>

            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              {dict.medicines.dialogs.deleteMedicine.willCannotUndo}
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
            <DialogClose>{dict.common.cancel}</DialogClose>
          </Button>

          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loading className='text-danger! h-4 w-4' />}

            {isLoading
              ? dict.medicines.dialogs.deleteMedicine.deleting
              : dict.medicines.dialogs.deleteMedicine.confirmDelete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMedicineDialog;
