import { Card } from '@/components/ui/card';
import { AppointmentInfoCardProps } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { formatDateAndTime } from '@/utils/formatters';
import {
  CalendarDays,
  ClipboardList,
  RefreshCcw,
  Stethoscope,
} from 'lucide-react';

const AppointmentInfoCard: React.FC<AppointmentInfoCardProps> = ({
  appointment,
}) => {
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center justify-between border-b p-4'>
        <div>
          <p className='text-sm font-semibold'>Appointment Overview</p>
        </div>
      </div>

      <div className='flex flex-col gap-4 p-4 text-sm'>
        {/* Symptoms */}
        <div className='flex items-start gap-3'>
          <Stethoscope className='text-secondary mt-0.5 h-4 w-4 shrink-0' />

          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Symptoms</p>

            <p className='font-medium'>
              {appointment.symptoms ? (
                appointment.symptoms
              ) : (
                <small className='text-muted-foreground truncate italic'>
                  Not recorded
                </small>
              )}
            </p>
          </div>
        </div>

        {/* Treatment effectiveness */}
        <div className='flex items-start gap-3'>
          <ClipboardList className='text-info mt-0.5 h-4 w-4 shrink-0' />

          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>
              Treatment Effectiveness
            </p>

            <p className='font-medium'>
              {appointment.treatment_effectiveness ? (
                appointment.treatment_effectiveness
              ) : (
                <small className='text-muted-foreground truncate italic'>
                  Not recorded
                </small>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className='border-border/60 bg-muted/30 flex items-center justify-between border-t px-4 py-3 text-xs'>
        {/* Created */}
        <div className='flex items-center gap-1.5'>
          <CalendarDays className='text-muted-foreground h-3.5 w-3.5' />

          <div>
            <p className='text-muted-foreground'>Created</p>

            <p className='font-medium'>
              {formatDateAndTime(appointment.created_at)}
            </p>
          </div>
        </div>

        {/* Updated */}
        <div className='flex items-center gap-1.5'>
          <RefreshCcw className='text-muted-foreground h-3.5 w-3.5' />

          <div>
            <p className='text-muted-foreground'>Last Updated</p>

            <p className='font-medium'>
              {formatDateAndTime(appointment.updated_at)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentInfoCard;
