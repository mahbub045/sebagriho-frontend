import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import {
  Appointment,
  AppointmentStatus,
} from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';

import { formatChoiceFieldValue, formatDateAndTime } from '@/utils/formatters';

import {
  CalendarDays,
  ClipboardList,
  RefreshCcw,
  Stethoscope,
} from 'lucide-react';

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  ACTIVE: 'border-success/40 bg-success/10 text-success',
  COMPLETED: 'border-info/40 bg-info/10 text-info',
  CANCELLED: 'border-danger/40 bg-danger/10 text-danger',
};

interface AppointmentInfoCardProps {
  appointment: Appointment;
}

const AppointmentInfoCard: React.FC<AppointmentInfoCardProps> = ({
  appointment,
}) => {
  const statusClass = STATUS_STYLES[appointment.status] ?? STATUS_STYLES.ACTIVE;

  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center justify-between border-b p-4'>
        <div>
          <p className='text-sm font-semibold'>Appointment Overview</p>

          <p className='text-muted-foreground mt-0.5 text-xs'>
            #{appointment.slug}
          </p>
        </div>

        <Badge
          variant='outline'
          className={`shrink-0 text-[11px] font-medium ${statusClass}`}
        >
          {formatChoiceFieldValue(appointment.status)}
        </Badge>
      </div>

      <div className='flex flex-col gap-4 p-4 text-sm'>
        {/* Symptoms */}
        <div className='flex items-start gap-3'>
          <Stethoscope className='text-secondary mt-0.5 h-4 w-4 shrink-0' />

          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Symptoms</p>

            <p className='font-medium'>
              {appointment.symptoms || 'Not recorded'}
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
              {appointment.treatment_effectiveness || 'Not recorded'}
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
