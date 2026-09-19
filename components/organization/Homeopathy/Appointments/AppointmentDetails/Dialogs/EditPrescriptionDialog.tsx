'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MEAL_TIMING_OPTIONS } from '@/data/common/ChoiceFields';
import { useEditAppointmentMutation } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  AppointmentPrescription,
  EditPrescriptionDialogProps,
} from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { useState } from 'react';
import { toast } from 'sonner';

interface PrescriptionDraft {
  uid: string;
  dosage: string;
  frequency: string;
  duration: string;
  meal_timing: string;
  instructions: string;
}

const toDraft = (item: AppointmentPrescription): PrescriptionDraft => ({
  uid: item.uid,
  dosage: item.dosage ?? '',
  frequency: item.frequency ?? '',
  duration: item.duration ?? '',
  meal_timing: item.meal_timing ?? '',
  instructions: item.instructions ?? '',
});

const EditPrescriptionDialog: React.FC<EditPrescriptionDialogProps> = ({
  isOpen,
  onClose,
  prescription,
  appointmentUid,
}) => {
  const { dict } = useTranslation();
  const [drafts, setDrafts] = useState<PrescriptionDraft[]>([]);

  // Tracks the prescription set/open state we last synced from, so the form
  // resets once per "open" transition rather than on every render.
  const [syncedKey, setSyncedKey] = useState<string | null>(null);
  const currentKey = isOpen
    ? prescription.map((item) => item.uid).join(',')
    : null;

  if (isOpen && currentKey !== syncedKey) {
    setSyncedKey(currentKey);
    setDrafts(prescription.map(toDraft));
  } else if (!isOpen && syncedKey !== null) {
    setSyncedKey(null);
  }

  const [editAppointment, { isLoading }] = useEditAppointmentMutation();

  const updateDraftField = (
    uid: string,
    field: keyof Omit<PrescriptionDraft, 'uid'>,
    value: string,
  ) => {
    setDrafts((current) =>
      current.map((item) =>
        item.uid === uid ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    try {
      await editAppointment({
        appointmentUid,
        appointmentData: {
          appointment_prescription: drafts.map((draft) => ({
            uid: draft.uid,
            dosage: draft.dosage || undefined,
            frequency: draft.frequency || undefined,
            duration: draft.duration || undefined,
            meal_timing: draft.meal_timing || undefined,
            instructions: draft.instructions || undefined,
          })),
        },
      }).unwrap();

      toast.success(dict.appointments.editPrescriptionDialog.updateSuccess);
      handleClose();
    } catch {
      toast.error(dict.appointments.editPrescriptionDialog.updateError);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-primary text-lg font-semibold'>
            {dict.appointments.editPrescriptionDialog.title}
          </DialogTitle>

          <DialogDescription>
            {dict.appointments.editPrescriptionDialog.description}
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-2 py-2'>
          {drafts.length === 0 && (
            <p className='text-muted-foreground py-6 text-center text-sm'>
              {dict.appointments.editPrescriptionDialog.noMedicinesLeft}
            </p>
          )}

          {drafts.map((draft) => {
            const item = prescription.find((p) => p.uid === draft.uid);
            if (!item) return null;

            return (
              <div
                key={draft.uid}
                className='border-primary/60 flex flex-col gap-2 rounded-lg border p-3'
              >
                <div className='flex items-center justify-between gap-2'>
                  <Badge variant='outline' className='w-fit font-medium'>
                    {item.medicine_details.name}
                    {item.medicine_details.power
                      ? ` • ${item.medicine_details.power}`
                      : ''}
                  </Badge>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <div className='flex flex-col gap-1'>
                    <Label htmlFor={`dosage-${draft.uid}`}>
                      {dict.appointments.editPrescriptionDialog.dosageLabel}
                    </Label>

                    <Input
                      id={`dosage-${draft.uid}`}
                      type='text'
                      placeholder={
                        dict.appointments.editPrescriptionDialog
                          .dosagePlaceholder
                      }
                      value={draft.dosage}
                      onChange={(event) =>
                        updateDraftField(
                          draft.uid,
                          'dosage',
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <Label htmlFor={`frequency-${draft.uid}`}>
                      {dict.appointments.editPrescriptionDialog.frequencyLabel}
                    </Label>

                    <Input
                      id={`frequency-${draft.uid}`}
                      type='text'
                      placeholder={
                        dict.appointments.editPrescriptionDialog
                          .frequencyPlaceholder
                      }
                      value={draft.frequency}
                      onChange={(event) =>
                        updateDraftField(
                          draft.uid,
                          'frequency',
                          event.target.value,
                        )
                      }
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-2'>
                  <div className='flex flex-col gap-1'>
                    <Label htmlFor={`duration-${draft.uid}`}>
                      {dict.appointments.editPrescriptionDialog.durationLabel}
                    </Label>

                    <Input
                      id={`duration-${draft.uid}`}
                      type='text'
                      placeholder={
                        dict.appointments.editPrescriptionDialog
                          .durationPlaceholder
                      }
                      value={draft.duration}
                      onChange={(event) =>
                        updateDraftField(
                          draft.uid,
                          'duration',
                          event.target.value,
                        )
                      }
                    />
                  </div>

                  <div className='flex flex-col gap-1'>
                    <Label htmlFor={`meal-timing-${draft.uid}`}>
                      {dict.appointments.editPrescriptionDialog.mealTimingLabel}
                    </Label>

                    <Select
                      items={MEAL_TIMING_OPTIONS}
                      value={draft.meal_timing}
                      onValueChange={(value) =>
                        updateDraftField(draft.uid, 'meal_timing', value || '')
                      }
                    >
                      <SelectTrigger
                        id={`meal-timing-${draft.uid}`}
                        className='w-full'
                      >
                        <SelectValue
                          placeholder={
                            dict.appointments.editPrescriptionDialog
                              .mealTimingPlaceholder
                          }
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {MEAL_TIMING_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='flex flex-col gap-1'>
                  <Label htmlFor={`instructions-${draft.uid}`}>
                    {dict.appointments.editPrescriptionDialog.instructionsLabel}
                  </Label>

                  <Textarea
                    id={`instructions-${draft.uid}`}
                    placeholder={
                      dict.appointments.editPrescriptionDialog
                        .instructionsPlaceholder
                    }
                    value={draft.instructions}
                    onChange={(event) =>
                      updateDraftField(
                        draft.uid,
                        'instructions',
                        event.target.value,
                      )
                    }
                    rows={2}
                    className='field-sizing-fixed'
                  />
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            {dict.common.cancel}
          </Button>

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loading className='text-white!' /> : ''}
            {dict.appointments.editPrescriptionDialog.saveChanges}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPrescriptionDialog;
