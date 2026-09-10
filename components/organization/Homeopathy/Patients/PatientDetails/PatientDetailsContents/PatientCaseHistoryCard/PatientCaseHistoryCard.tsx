import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PatientDetailsCardProps } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { Edit, ScrollText } from 'lucide-react';
import { useState } from 'react';
import EditMedicalGistoryDialog from '../../Dialogs/EditMedicalHistoryDialog';

const PatientCaseHistoryCard: React.FC<PatientDetailsCardProps> = ({
  patient,
}) => {
  const [isOpenEditPatientDialog, setIsOpenEditPatientDialog] = useState(false);
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center justify-between gap-2 border-b p-4'>
        <div className='flex items-center gap-2'>
          <ScrollText className='text-warning h-4 w-4' />
          <h3 className='text-sm font-semibold'>Case History</h3>
        </div>

        <Button
          size='sm'
          variant='default'
          onClick={() => setIsOpenEditPatientDialog(true)}
        >
          <Edit />
          Edit
        </Button>
      </div>
      <div className='p-4 text-sm'>
        {patient.case_history ? (
          <p className='text-foreground/90 whitespace-pre-line'>
            {patient.case_history}
          </p>
        ) : (
          <p className='text-muted-foreground italic'>
            No case history recorded.
          </p>
        )}
      </div>
      <EditMedicalGistoryDialog
        isOpen={isOpenEditPatientDialog}
        onClose={() => setIsOpenEditPatientDialog(false)}
        patientInfo={patient}
      />
    </Card>
  );
};

export default PatientCaseHistoryCard;
