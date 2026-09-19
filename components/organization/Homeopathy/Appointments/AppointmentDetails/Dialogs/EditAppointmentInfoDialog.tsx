'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEditAppointmentMutation } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { EditAppointmentInfoDialogProps } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { useState } from 'react';
import { toast } from 'sonner';

const EditAppointmentInfoDialog: React.FC<EditAppointmentInfoDialogProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
  const { dict } = useTranslation();
  const [symptoms, setSymptoms] = useState('');
  const [treatmentEffectiveness, setTreatmentEffectiveness] = useState('');

  // Tracks the last appointment/open state we synced from, so we only
  // reset the form once per "open" transition rather than on every render.
  const [syncedKey, setSyncedKey] = useState<string | null>(null);
  const currentKey = isOpen ? (appointment?.uid ?? '') : null;

  if (isOpen && currentKey !== syncedKey) {
    setSyncedKey(currentKey);
    setSymptoms(appointment?.symptoms ?? '');
    setTreatmentEffectiveness(appointment?.treatment_effectiveness ?? '');
  } else if (!isOpen && syncedKey !== null) {
    setSyncedKey(null);
  }

  const [editAppointment, { isLoading, error }] = useEditAppointmentMutation();

  // DRF-style error payloads key validation messages by field name, e.g.
  // { symptoms: ["This field may not be blank."], treatment_effectiveness: [...] }
  const fieldErrors =
    error && typeof error === 'object' && 'data' in error
      ? (error.data as Record<string, string[] | string> | undefined)
      : undefined;

  const getFieldError = (field: string) => {
    const value = fieldErrors?.[field];
    if (!value) return undefined;
    return Array.isArray(value) ? value.join(' ') : value;
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!appointment?.uid) return;

    try {
      await editAppointment({
        appointmentUid: appointment.uid,
        appointmentData: {
          symptoms: symptoms.trim(),
          treatment_effectiveness: treatmentEffectiveness.trim(),
        },
      }).unwrap();

      toast.success(dict.appointments.editInfoDialog.updateSuccess);
      handleClose();
    } catch {
      toast.error(dict.appointments.editInfoDialog.updateError);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-primary text-lg font-semibold'>
            {dict.appointments.editInfoDialog.title}
          </DialogTitle>

          <DialogDescription>
            {dict.appointments.editInfoDialog.description}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-5 py-2'>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='symptoms'>
              {dict.appointments.editInfoDialog.symptomsLabel}
            </Label>

            <Textarea
              id='symptoms'
              placeholder={dict.appointments.editInfoDialog.symptomsPlaceholder}
              value={symptoms}
              onChange={(event) => setSymptoms(event.target.value)}
              rows={3}
              className='field-sizing-fixed'
            />

            {getFieldError('symptoms') && (
              <p className='text-danger text-xs'>{getFieldError('symptoms')}</p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='treatment_effectiveness'>
              {dict.appointments.editInfoDialog.treatmentEffectivenessLabel}
            </Label>

            <Textarea
              id='treatment_effectiveness'
              placeholder={
                dict.appointments.editInfoDialog
                  .treatmentEffectivenessPlaceholder
              }
              value={treatmentEffectiveness}
              onChange={(event) =>
                setTreatmentEffectiveness(event.target.value)
              }
              rows={3}
              className='field-sizing-fixed'
            />

            {getFieldError('treatment_effectiveness') && (
              <p className='text-danger text-xs'>
                {getFieldError('treatment_effectiveness')}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            {dict.common.cancel}
          </Button>

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loading className='text-white!' /> : ''}
            {dict.appointments.editInfoDialog.saveChanges}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentInfoDialog;
