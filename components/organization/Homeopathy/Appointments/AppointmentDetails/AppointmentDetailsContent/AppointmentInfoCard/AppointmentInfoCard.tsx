'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  HOMEOPATHIC_APPOINTMENT_STATUS_OPTIONS,
  localizeOptions,
} from '@/data/common/ChoiceFields';
import {
  APPOINTMENT_STATUS_BADGE,
  STATUS_DOT_COLOR,
} from '@/data/Organization/Homeopathy/Appointments/AppointmentsData';
import { useEditAppointmentMutation } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  AppointmentInfoCardProps,
  AppointmentStatus,
} from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { formatDateAndTime } from '@/utils/formatters';
import {
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Edit,
  RefreshCcw,
  Stethoscope,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import EditAppointmentInfoDialog from '../../Dialogs/EditAppointmentInfoDialog';

const AppointmentInfoCard: React.FC<AppointmentInfoCardProps> = ({
  appointment,
}) => {
  const { dict, locale } = useTranslation();
  const [isOpenAppointmentEditDialog, setIsOpenAppointmentEditDialog] =
    useState(false);

  const [editAppointment, { isLoading: isUpdatingStatus }] =
    useEditAppointmentMutation();

  const homeopathicAppointmentStatusOptions = localizeOptions(
    HOMEOPATHIC_APPOINTMENT_STATUS_OPTIONS,
    locale,
  );

  const statusBadge = APPOINTMENT_STATUS_BADGE[appointment.status];
  const statusLabel = homeopathicAppointmentStatusOptions.find(
    (option) => option.value === appointment.status,
  )?.label;

  const handleStatusChange = async (value: string | null) => {
    if (!value || value === appointment.status) return;

    try {
      await editAppointment({
        appointmentUid: appointment.uid,
        appointmentData: { status: value as AppointmentStatus },
      }).unwrap();

      toast.success(dict.appointments.infoCard.statusUpdateSuccess);
    } catch {
      toast.error(dict.appointments.infoCard.statusUpdateError);
    }
  };

  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center justify-between border-b p-4'>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-semibold'>
            {dict.appointments.infoCard.overview}
          </p>

          <Select
            items={homeopathicAppointmentStatusOptions}
            value={appointment.status}
            onValueChange={handleStatusChange}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger
              size='sm'
              className='h-auto w-fit cursor-pointer border-none bg-transparent p-0 shadow-none focus-visible:ring-0 [&>svg]:hidden'
            >
              <SelectValue>
                {statusBadge && (
                  <Badge variant={statusBadge.variant} size='lg'>
                    {statusLabel}
                    <ChevronDown data-icon='inline-end' className='size-3!' />
                  </Badge>
                )}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {homeopathicAppointmentStatusOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='cursor-pointer'
                >
                  <span
                    className={`size-2 shrink-0 self-center rounded-full ${
                      STATUS_DOT_COLOR[option.value as AppointmentStatus]
                    }`}
                  />
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant='default'
          size='sm'
          onClick={() => setIsOpenAppointmentEditDialog(true)}
        >
          <Edit />
          {dict.appointments.infoCard.edit}
        </Button>
      </div>

      <div className='flex flex-col gap-4 p-4 text-sm'>
        {/* Symptoms */}
        <div className='flex items-start gap-3'>
          <Stethoscope className='text-secondary mt-0.5 h-4 w-4 shrink-0' />

          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>
              {dict.appointments.infoCard.symptoms}
            </p>

            <p className='font-medium'>
              {appointment.symptoms ? (
                appointment.symptoms
              ) : (
                <small className='text-muted-foreground truncate italic'>
                  {dict.appointments.infoCard.notRecorded}
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
              {dict.appointments.infoCard.treatmentEffectiveness}
            </p>

            <p className='font-medium'>
              {appointment.treatment_effectiveness ? (
                appointment.treatment_effectiveness
              ) : (
                <small className='text-muted-foreground truncate italic'>
                  {dict.appointments.infoCard.notRecorded}
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
            <p className='text-muted-foreground'>
              {dict.appointments.infoCard.created}
            </p>

            <p className='font-medium'>
              {formatDateAndTime(appointment.created_at)}
            </p>
          </div>
        </div>

        {/* Updated */}
        <div className='flex items-center gap-1.5'>
          <RefreshCcw className='text-muted-foreground h-3.5 w-3.5' />

          <div>
            <p className='text-muted-foreground'>
              {dict.appointments.infoCard.lastUpdated}
            </p>

            <p className='font-medium'>
              {formatDateAndTime(appointment.updated_at)}
            </p>
          </div>
        </div>
      </div>
      {/* dialog  */}
      <EditAppointmentInfoDialog
        isOpen={isOpenAppointmentEditDialog}
        onClose={() => setIsOpenAppointmentEditDialog(false)}
        appointment={appointment}
      />
    </Card>
  );
};

export default AppointmentInfoCard;
