'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicineDetailsCardProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getCurrencySymbol } from '@/utils/constants';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import EditMedicineInventoryDialog from '../../Dialogs/EditMedicineInventoryDialog';

const MedicineInventoryCard: React.FC<MedicineDetailsCardProps> = ({
  medicine,
}) => {
  const { dict } = useTranslation();
  const [isOpenMedicineEditDialog, setIsOpenMedicineEditDialog] =
    useState(false);

  return (
    <Card>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle className='text-base font-semibold'>
          {dict.medicines.details.inventoryCard.title}
        </CardTitle>
        <Button
          variant='default'
          size='sm'
          onClick={() => setIsOpenMedicineEditDialog(true)}
        >
          <Edit />
          {dict.common.edit}
        </Button>
      </CardHeader>

      <CardContent className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-sm'>
            {dict.medicines.details.inventoryCard.totalQuantity}
          </p>
          <p className='text-sm font-medium'>
            {medicine.total_quantity || '0'}
          </p>
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-sm'>
            {dict.medicines.details.inventoryCard.unitPrice}
          </p>
          {medicine.unit_price === null ? (
            <small className='italic'>
              {dict.medicines.details.inventoryCard.notSpecified}
            </small>
          ) : (
            <p className='text-sm font-medium'>
              {getCurrencySymbol()}
              {medicine.unit_price || '0.00'}
            </p>
          )}
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
