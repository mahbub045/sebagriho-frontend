import { AppointmentStatus } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';

export const STATUS_STYLES: Record<AppointmentStatus, string> = {
  SCHEDULED: 'border-success/40 bg-success/10 text-success',
  COMPLETED: 'border-info/40 bg-info/10 text-info',
  CANCELLED: 'border-danger/40 bg-danger/10 text-danger',
};

export const APPOINTMENT_STATUS_BADGE: Record<
  AppointmentStatus,
  { label: string; variant: 'default' | 'success' | 'danger' }
> = {
  SCHEDULED: { label: 'Scheduled', variant: 'default' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
};

export const STATUS_DOT_COLOR: Record<AppointmentStatus, string> = {
  SCHEDULED: 'bg-primary',
  COMPLETED: 'bg-success',
  CANCELLED: 'bg-danger',
};
