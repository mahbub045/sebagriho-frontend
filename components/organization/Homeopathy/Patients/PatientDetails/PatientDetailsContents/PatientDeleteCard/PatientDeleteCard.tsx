'use client';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import DeletePatientDialog from '../../Dialogs/DeletePatientDialog';

type Props = {
  patientUid: string;
  patientName: string;
};

const PatientDeleteCard: React.FC<Props> = ({ patientUid, patientName }) => {
  const { dict } = useTranslation();
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [before, after] = dict.patients.detail.deleteCard.description.split(
    '{name}',
  );
  return (
    <div className='border-danger/20 bg-danger/5 flex w-full flex-col gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-start gap-3'>
        <TriangleAlert className='text-danger mt-0.5 h-4 w-4 shrink-0' />
        <p className='text-muted-foreground text-sm leading-relaxed'>
          {before}
          <span className='text-foreground font-medium'>{patientName}</span>
          {after}
        </p>
      </div>
      <Button variant='destructive' onClick={() => setIsOpenDeleteDialog(true)}>
        {dict.patients.detail.deleteCard.deletePatient}
      </Button>

      {/* Dialog for deleting patient */}
      <DeletePatientDialog
        isOpen={isOpenDeleteDialog}
        onClose={() => setIsOpenDeleteDialog(false)}
        patientUid={patientUid}
        patientName={patientName}
      />
    </div>
  );
};

export default PatientDeleteCard;
