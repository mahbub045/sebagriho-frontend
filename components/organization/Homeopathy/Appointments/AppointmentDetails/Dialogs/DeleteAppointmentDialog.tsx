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
import { useDeleteAppointmentMutation } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import { DeleteAppointmentDialogProps } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const DeleteAppointmentDialog: React.FC<DeleteAppointmentDialogProps> = ({
  isOpen,
  onClose,
  appointmentUid,
  appointmentPatientName,
}) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const [deleteAppointment, { isLoading }] = useDeleteAppointmentMutation();

  const handleDelete = async () => {
    try {
      await deleteAppointment(appointmentUid).unwrap();
      toast.success('Appointment deleted successfully');
      onClose();
      router.back();
    } catch (error) {
      setErrorMessage('Failed to delete appointment. Please try again.');
      //   console.error('Failed to delete appointment:', error);
      toast.error('Failed to delete appointment. Please try again.');
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
            Delete {appointmentPatientName}?
          </DialogTitle>

          <DialogDescription className='text-center sm:text-left'>
            This action is permanent and can&apos;t be reversed.
          </DialogDescription>
        </DialogHeader>

        <div className='border-danger/20 bg-danger/5 rounded-lg border p-3'>
          <p className='text-sm font-medium'>Deleting this appointment will:</p>

          <ul className='text-muted-foreground mt-2 space-y-1.5 text-sm'>
            <li className='flex gap-2'>
              <span className='text-danger'>•</span>
              Permanently remove the appointment record
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

            {isLoading ? 'Deleting...' : 'Yes, delete appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAppointmentDialog;
