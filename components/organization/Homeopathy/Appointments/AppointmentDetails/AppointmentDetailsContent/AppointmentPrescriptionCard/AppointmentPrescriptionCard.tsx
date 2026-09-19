'use client';
import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEditAppointmentMutation } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  AppointmentPrescription,
  MedicinesCardProps,
} from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { formatChoiceFieldValue } from '@/utils/formatters';
import {
  CalendarDays,
  Clock3,
  Droplets,
  Pencil,
  Pill,
  Plus,
  StickyNoteCheck,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import AddNewMedicineDialog from '../../Dialogs/AddNewMedicineDialog';
import EditPrescriptionDialog from '../../Dialogs/EditPrescriptionDialog';

const AppointmentPrescriptionCard: React.FC<MedicinesCardProps> = ({
  appointment_prescription,
  appointmentUid,
}) => {
  const { dict } = useTranslation();
  const [isOpenAppointmentEditDialog, setIsOpenAppointmentEditDialog] =
    useState(false);
  const [isOpenAddDialog, setIsOpenAddDialog] = useState(false);
  const [editingPrescription, setEditingPrescription] =
    useState<AppointmentPrescription | null>(null);
  const [deletingUid, setDeletingUid] = useState<string | null>(null);

  const [editAppointment] = useEditAppointmentMutation();

  const handleEditClick = (prescription: AppointmentPrescription) => {
    setEditingPrescription(prescription);
    setIsOpenAppointmentEditDialog(true);
  };

  const handleDelete = async (prescription: AppointmentPrescription) => {
    setDeletingUid(prescription.uid);

    try {
      await editAppointment({
        appointmentUid,
        appointmentData: {
          remove_prescription_uids: [prescription.uid],
        },
      }).unwrap();

      toast.success(dict.appointments.prescriptionCard.removeSuccess);
    } catch {
      toast.error(dict.appointments.prescriptionCard.removeError);
    } finally {
      setDeletingUid(null);
    }
  };

  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center justify-between border-b px-4 py-3.5'>
        <div className='flex items-center gap-2.5'>
          <div className='bg-secondary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full'>
            <Pill className='text-secondary h-4 w-4' />
          </div>

          <p className='text-sm font-semibold'>
            {dict.appointments.prescriptionCard.medicines.replace(
              '{count}',
              appointment_prescription.length > 0
                ? `(${appointment_prescription.length})`
                : '',
            )}
          </p>
        </div>

        <Button
          type='button'
          variant='default'
          size='sm'
          onClick={() => setIsOpenAddDialog(true)}
        >
          <Plus className='h-3.5 w-3.5' />
          {dict.appointments.prescriptionCard.addNewMedicine}
        </Button>
      </div>

      {appointment_prescription.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-1.5 px-4 py-10 text-center'>
          <Pill className='text-muted-foreground/30 h-7 w-7' />

          <p className='text-muted-foreground text-xs'>
            {dict.appointments.prescriptionCard.noMedicinesPrescribed}
          </p>
        </div>
      ) : (
        <div className='divide-border/60 [&::-webkit-scrollbar-thumb]:bg-border max-h-62.5 divide-y overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent'>
          {appointment_prescription.map((prescription) => {
            const isDeleting = deletingUid === prescription.uid;

            return (
              <div
                key={prescription.uid}
                className='group hover:bg-muted/30 flex flex-col gap-0.5 px-4 py-3.5 text-sm transition-colors'
              >
                <div className='flex items-center justify-between gap-3'>
                  <div className='min-w-0'>
                    <div className='flex items-baseline gap-1.5'>
                      <p className='truncate font-medium'>
                        {prescription.medicine_details.name}
                      </p>

                      {prescription.medicine_details.power && (
                        <span className='bg-muted text-muted-foreground shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium'>
                          {prescription.medicine_details.power}
                        </span>
                      )}
                    </div>

                    {prescription.medicine_details.manufacturer && (
                      <p className='text-muted-foreground mt-0.5 truncate text-xs'>
                        {prescription.medicine_details.manufacturer}
                      </p>
                    )}
                  </div>

                  <div className='flex shrink-0 items-center gap-3'>
                    <div className='text-muted-foreground space-y-1 text-right text-xs'>
                      {prescription.dosage && (
                        <p className='flex items-center justify-end gap-1'>
                          {prescription.dosage}
                          <Droplets className='h-3 w-3' />
                        </p>
                      )}
                      {prescription.frequency && (
                        <p className='flex items-center justify-end gap-1'>
                          {prescription.frequency}
                          <Clock3 className='h-3 w-3' />
                        </p>
                      )}
                      {prescription.duration ? (
                        <p className='flex items-center justify-end gap-1'>
                          {dict.appointments.prescriptionCard.days.replace(
                            '{count}',
                            String(prescription.duration),
                          )}
                          <CalendarDays className='h-3 w-3' />
                        </p>
                      ) : (
                        <p className='flex items-center justify-end gap-1'>
                          {dict.appointments.prescriptionCard.days.replace(
                            '{count}',
                            '0',
                          )}
                          <CalendarDays className='h-3 w-3' />
                        </p>
                      )}
                    </div>

                    <div className='border-primary/60 flex items-center gap-0.5 border-l pl-2.5 transition-opacity group-hover:opacity-100'>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => handleEditClick(prescription)}
                      >
                        <Pencil className='h-3.5 w-3.5' />
                      </Button>

                      <Button
                        type='button'
                        variant='destructive'
                        size='icon'
                        onClick={() => handleDelete(prescription)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <Loading className='h-3.5 w-3.5' />
                        ) : (
                          <Trash2 className='h-3.5 w-3.5' />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {(prescription.meal_timing || prescription.instructions) && (
                  <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                    {prescription.meal_timing && (
                      <Badge
                        variant='default'
                        className={
                          prescription.meal_timing === 'BEFORE_MEAL'
                            ? 'border-transparent bg-amber-100 text-xs text-amber-800 hover:bg-amber-100'
                            : 'border-transparent bg-emerald-100 text-xs text-emerald-800 hover:bg-emerald-100'
                        }
                      >
                        {formatChoiceFieldValue(prescription.meal_timing)}
                      </Badge>
                    )}

                    {prescription.instructions && (
                      <p className='text-muted-foreground flex min-w-0 items-center gap-1 truncate text-xs italic'>
                        <StickyNoteCheck className='h-3 w-3 shrink-0' />
                        {prescription.instructions}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* dialogs  */}
      <EditPrescriptionDialog
        isOpen={isOpenAppointmentEditDialog}
        onClose={() => {
          setIsOpenAppointmentEditDialog(false);
          setEditingPrescription(null);
        }}
        prescription={
          editingPrescription ? [editingPrescription] : appointment_prescription
        }
        appointmentUid={appointmentUid}
      />
      <AddNewMedicineDialog
        isOpen={isOpenAddDialog}
        onClose={() => setIsOpenAddDialog(false)}
        appointmentUid={appointmentUid}
      />
    </Card>
  );
};

export default AppointmentPrescriptionCard;
