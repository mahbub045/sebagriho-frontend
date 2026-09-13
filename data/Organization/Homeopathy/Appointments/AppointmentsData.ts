import { AppointmentStatus } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';

export const STATUS_STYLES: Record<AppointmentStatus, string> = {
  ACTIVE: 'border-success/40 bg-success/10 text-success',
  COMPLETED: 'border-info/40 bg-info/10 text-info',
  CANCELLED: 'border-danger/40 bg-danger/10 text-danger',
};
