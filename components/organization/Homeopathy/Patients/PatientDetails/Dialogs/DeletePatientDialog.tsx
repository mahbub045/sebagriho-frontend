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

import { useDeletePatientMutation } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { DeletePatientDialogProps } from '@/types/Organization/Homeopathy/Patients/PatientsType';

import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const DeletePatientDialog: React.FC<DeletePatientDialogProps> = ({
  isOpen,
  onClose,
  patientUid,
  patientName,
}) => {
  const { dict } = useTranslation();
  const router = useRouter();
  const [deletePatient, { isLoading }] = useDeletePatientMutation();
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    try {
      setErrorMessage('');

      await deletePatient({
        patientUid: patientUid,
      }).unwrap();
      toast.success(dict.patients.dialogs.deletePatient.successToast);
      onClose();
      router.back();
    } catch (error) {
      console.error('Failed to delete patient:', error);
      toast.error(dict.patients.dialogs.deletePatient.errorToast);
      setErrorMessage(dict.patients.dialogs.deletePatient.errorToast);
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
            {dict.patients.dialogs.deletePatient.title.replace(
              '{name}',
              patientName,
            )}
          </DialogTitle>

          <DialogDescription className='text-center sm:text-left'>
            {dict.patients.dialogs.deletePatient.description}
          </DialogDescription>
        </DialogHeader>

        <div className='border-danger/20 bg-danger/5 rounded-lg border p-3'>
          <p className='text-sm font-medium'>
            {dict.patients.dialogs.deletePatient.warningTitle}
          </p>

          <ul className='text-muted-foreground mt-2 space-y-1.5 text-sm'>
            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              {dict.patients.dialogs.deletePatient.warningItem1}
            </li>

            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              {dict.patients.dialogs.deletePatient.warningItem2}
            </li>

            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              {dict.patients.dialogs.deletePatient.warningItem3}
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
              ? dict.patients.dialogs.deletePatient.deleting
              : dict.patients.dialogs.deletePatient.confirmDelete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePatientDialog;
