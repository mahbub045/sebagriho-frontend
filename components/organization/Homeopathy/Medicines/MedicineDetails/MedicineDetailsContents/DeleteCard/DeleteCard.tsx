import { Button } from '@/components/ui/button';
import { MedicineDetailsCardProps } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import DeleteMedicineDialog from '../../Dialogs/DeleteMedicineDialog';

const DeleteCard: React.FC<MedicineDetailsCardProps> = ({ medicine }) => {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  return (
    <div className='border-danger/20 bg-danger/5 flex w-full flex-col gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-start gap-3'>
        <TriangleAlert className='text-danger mt-0.5 h-4 w-4 shrink-0' />
        <p className='text-muted-foreground text-sm leading-relaxed'>
          This permanently removes{' '}
          <span className='text-foreground font-medium'>{medicine.name}</span>{' '}
          and all its data. This can&apos;t be undone.
        </p>
      </div>
      <Button variant='destructive' onClick={() => setIsOpenDeleteDialog(true)}>
        Delete Medicine
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

export default DeleteCard;
