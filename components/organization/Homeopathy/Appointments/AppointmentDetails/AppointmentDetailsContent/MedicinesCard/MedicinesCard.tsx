import { Card } from '@/components/ui/card';
import { MedicinesCardProps } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { Pill } from 'lucide-react';

const MedicinesCard: React.FC<MedicinesCardProps> = ({ medicines }) => {
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center gap-2 border-b p-4'>
        <Pill className='text-secondary h-4 w-4' />

        <p className='text-sm font-semibold'>
          Medicines {medicines.length > 0 && `(${medicines.length})`}
        </p>
      </div>

      {medicines.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-1.5 px-4 py-10 text-center'>
          <Pill className='text-muted-foreground/30 h-7 w-7' />

          <p className='text-muted-foreground text-xs'>
            No medicines prescribed yet.
          </p>
        </div>
      ) : (
        <div className='divide-border/60 divide-y'>
          {medicines.map((medicine) => (
            <div
              key={medicine.uid}
              className='flex items-center justify-between gap-3 p-4 text-sm'
            >
              <div className='min-w-0'>
                <p className='truncate font-medium'>{medicine.name}</p>

                {medicine.notes && (
                  <p className='text-muted-foreground mt-0.5 truncate text-xs'>
                    {medicine.notes}
                  </p>
                )}
              </div>

              <div className='text-muted-foreground shrink-0 text-right text-xs'>
                {medicine.dosage && <p>{medicine.dosage}</p>}

                {medicine.frequency && <p>{medicine.frequency}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default MedicinesCard;
