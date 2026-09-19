'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MedicineDetailsCardProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import EditMedicineDescriptionDialog from '../../Dialogs/EditMedicineDescriptionDialog';

const MedicineDescriptionCard: React.FC<MedicineDetailsCardProps> = ({
  medicine,
}) => {
  const { dict } = useTranslation();
  const [isOpenMedicineEditDialog, setIsOpenMedicineEditDialog] =
    useState(false);

  return (
    <Card>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle className='text-base font-semibold'>
          {dict.medicines.details.descriptionCard.title}
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

      <CardContent>
        <p className='text-muted-foreground text-sm whitespace-pre-line'>
          {medicine.description ||
            dict.medicines.details.descriptionCard.noDescription}
        </p>
      </CardContent>
      {/* dialog  */}
      <EditMedicineDescriptionDialog
        isOpen={isOpenMedicineEditDialog}
        onClose={() => setIsOpenMedicineEditDialog(false)}
        medicine={medicine}
      />
    </Card>
  );
};

export default MedicineDescriptionCard;
