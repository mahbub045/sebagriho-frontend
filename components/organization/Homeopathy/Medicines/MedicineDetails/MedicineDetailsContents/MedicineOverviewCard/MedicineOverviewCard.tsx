import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicineDetailsCardProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import EditMedicineOverviewDialog from '../../Dialogs/EditMedicineOverviewDialog';

const MedicineOverviewCard: React.FC<MedicineDetailsCardProps> = ({
  medicine,
}) => {
  const [isOpenMedicineEditDialog, setIsOpenMedicineEditDialog] =
    useState(false);

  return (
    <Card>
      <CardHeader className='flex flex-row items-start justify-between gap-3'>
        <div>
          <CardTitle className='text-primary flex items-center gap-2 text-xl font-semibold'>
            <span>{medicine.name}</span>
          </CardTitle>
          <p className='text-muted-foreground text-sm'>
            Power:{' '}
            {medicine.power ? (
              medicine.power
            ) : (
              <span className='italic'>Not specified</span>
            )}
          </p>
        </div>

        <Button
          variant='default'
          size='sm'
          onClick={() => setIsOpenMedicineEditDialog(true)}
        >
          <Edit />
          Edit
        </Button>
      </CardHeader>

      <CardContent className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div>
          <p className='text-muted-foreground text-xs'>Manufacturer</p>
          <p className='text-sm font-medium'>
            {medicine.manufacturer ? (
              medicine.manufacturer
            ) : (
              <span className='italic'>Not specified</span>
            )}
          </p>
        </div>
        <div>
          <p className='text-muted-foreground text-xs'>Batch Number</p>
          <p className='text-sm font-medium'>
            {medicine.batch_number ? (
              medicine.batch_number
            ) : (
              <span className='italic'>Not specified</span>
            )}
          </p>
        </div>
      </CardContent>
      {/* Dialog  */}
      <EditMedicineOverviewDialog
        isOpen={isOpenMedicineEditDialog}
        onClose={() => setIsOpenMedicineEditDialog(false)}
        medicine={medicine}
      />
    </Card>
  );
};

export default MedicineOverviewCard;
