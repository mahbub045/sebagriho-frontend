import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { MedicineDetailsCardProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import DeleteMedicineDialog from '../../Dialogs/DeleteMedicineDialog';

const MedicineDeleteCard: React.FC<MedicineDetailsCardProps> = ({ medicine }) => {
  const { dict } = useTranslation();
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [warningPrefix, warningSuffix] =
    dict.medicines.details.deleteCard.warning.split('{medicineName}');
  return (
    <div className='border-danger/20 bg-danger/5 flex w-full flex-col gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-start gap-3'>
        <TriangleAlert className='text-danger mt-0.5 h-4 w-4 shrink-0' />
        <p className='text-muted-foreground text-sm leading-relaxed'>
          {warningPrefix}
          <span className='text-foreground font-medium'>{medicine.name}</span>
          {warningSuffix}
        </p>
      </div>
      <Button variant='destructive' onClick={() => setIsOpenDeleteDialog(true)}>
        {dict.medicines.details.deleteCard.deleteButton}
      </Button>

      {/* Dialog for deleting medicine */}
      <DeleteMedicineDialog
        isOpen={isOpenDeleteDialog}
        onClose={() => setIsOpenDeleteDialog(false)}
        medicineUid={medicine.uid}
        medicineName={medicine.name}
      />
    </div>
  );
};

export default MedicineDeleteCard;
