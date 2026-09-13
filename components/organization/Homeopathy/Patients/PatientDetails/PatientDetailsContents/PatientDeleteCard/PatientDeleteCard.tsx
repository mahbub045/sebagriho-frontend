import { Button } from '@/components/ui/button';
import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import DeletePatientDialog from '../../Dialogs/DeletePatientDialog';

type Props = {
  patientUid: string;
  patientName: string;
};

const PatientDeleteCard: React.FC<Props> = ({ patientUid, patientName }) => {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  return (
    <div className='border-danger/20 bg-danger/5 flex w-full flex-col gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-start gap-3'>
        <TriangleAlert className='text-danger mt-0.5 h-4 w-4 shrink-0' />
        <p className='text-muted-foreground text-sm leading-relaxed'>
          This permanently removes{' '}
          <span className='text-foreground font-medium'>{patientName}</span> and
          all its data. This can&apos;t be undone.
        </p>
      </div>
      <Button variant='destructive' onClick={() => setIsOpenDeleteDialog(true)}>
        Delete Patient
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
