import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicineDetailsCardProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { getCurrencySymbol } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import EditMedicineInventoryDialog from '../../Dialogs/EditMedicineInventoryDialog';

const MedicineInventoryCard: React.FC<MedicineDetailsCardProps> = ({
  medicine,
}) => {
  const [isOpenMedicineEditDialog, setIsOpenMedicineEditDialog] =
    useState(false);

  return (
    <Card>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle className='text-base font-semibold'>Inventory</CardTitle>
        <Button
          variant='default'
          size='sm'
          onClick={() => setIsOpenMedicineEditDialog(true)}
        >
          <Edit />
          Edit
        </Button>
      </CardHeader>

      <CardContent className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-sm'>Total Quantity</p>
          <p className='text-sm font-medium'>
            {medicine.total_quantity || '0'}
          </p>
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-sm'>Unit Price</p>
          {medicine.unit_price === null ? (
            <small className='italic'>Not specified</small>
          ) : (
            <p className='text-sm font-medium'>
              {getCurrencySymbol()}
              {medicine.unit_price || '0.00'}
            </p>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-sm'>Expiration Date</p>
          <p className='text-sm font-medium'>
            {medicine.expiration_date ? (
              formatDate(medicine.expiration_date)
            ) : (
              <small className='italic'>Not specified</small>
            )}
          </p>
        </div>
      </CardContent>

      {/* Dialog  */}
      <EditMedicineInventoryDialog
        isOpen={isOpenMedicineEditDialog}
        onClose={() => setIsOpenMedicineEditDialog(false)}
        medicine={medicine}
      />
    </Card>
  );
};

export default MedicineInventoryCard;
