import { Button } from '@/components/ui/button';
import { DeleteCardProps } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import DeleteAppointmentDialog from '../../Dialogs/DeleteAppointmentDialog';

const AppointmentDeleteCard: React.FC<DeleteCardProps> = ({ appointment }) => {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  return (
    <div className='border-danger/20 bg-danger/5 mt-4 flex w-full flex-col gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-start gap-3'>
        <TriangleAlert className='text-danger mt-0.5 h-4 w-4 shrink-0' />
        <p className='text-muted-foreground text-sm leading-relaxed'>
          This permanently removes{' '}
          <span className='text-foreground font-medium'>
            {appointment.patient.user.first_name}{' '}
            {appointment.patient.user.last_name}
            &#39;s appointment
          </span>{' '}
          and all its data. This can&apos;t be undone.
        </p>
      </div>
      <Button variant='destructive' onClick={() => setIsOpenDeleteDialog(true)}>
        Delete Appointment
      </Button>

      {/* Dialog for deleting appointment */}
      <DeleteAppointmentDialog
        isOpen={isOpenDeleteDialog}
        onClose={() => setIsOpenDeleteDialog(false)}
        appointmentUid={appointment.uid}
        appointmentPatientName={
          appointment.patient.user.first_name +
          ' ' +
          appointment.patient.user.last_name
        }
      />
    </div>
  );
};

export default AppointmentDeleteCard;
