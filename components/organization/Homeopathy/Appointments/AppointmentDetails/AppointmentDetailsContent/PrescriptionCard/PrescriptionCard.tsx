import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MedicinesCardProps } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { formatChoiceFieldValue } from '@/utils/formatters';
import {
  CalendarDays,
  Clock3,
  Droplets,
  Pill,
  StickyNoteCheck,
} from 'lucide-react';

const PrescriptionCard: React.FC<MedicinesCardProps> = ({
  appointment_prescription,
}) => {
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center gap-2.5 border-b px-4 py-3.5'>
        <div className='bg-secondary/10 flex h-7 w-7 items-center justify-center rounded-full'>
          <Pill className='text-secondary h-3.5 w-3.5' />
        </div>

        <p className='text-sm font-semibold'>
          Medicines{' '}
          {appointment_prescription.length > 0 &&
            `(${appointment_prescription.length})`}
        </p>
      </div>

      {appointment_prescription.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-1.5 px-4 py-10 text-center'>
          <Pill className='text-muted-foreground/30 h-7 w-7' />

          <p className='text-muted-foreground text-xs'>
            No medicines prescribed yet.
          </p>
        </div>
      ) : (
        <div className='divide-border/60 [&::-webkit-scrollbar-thumb]:bg-border max-h-105 divide-y overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent'>
          {appointment_prescription.map((prescription) => {
            return (
              <div
                key={prescription.uid}
                className='hover:bg-muted/30 flex flex-col gap-0.5 px-4 py-3.5 text-sm transition-colors'
              >
                <div className='flex items-start justify-between gap-3'>
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

                  <div className='text-muted-foreground shrink-0 space-y-1 text-right text-xs'>
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
                    {prescription.duration && (
                      <p className='flex items-center justify-end gap-1'>
                        {prescription.duration}
                        <CalendarDays className='h-3 w-3' />
                      </p>
                    )}
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
    </Card>
  );
};

export default PrescriptionCard;
