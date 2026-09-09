import { Card } from '@/components/ui/card';
import { Patient } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { ScrollText } from 'lucide-react';

interface Props {
  patient: Patient;
}

const PatientCaseHistoryCard: React.FC<Props> = ({ patient }) => {
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center gap-2 border-b p-4'>
        <ScrollText className='text-warning h-4 w-4' />
        <h3 className='text-sm font-semibold'>Case History</h3>
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
    </Card>
  );
};

export default PatientCaseHistoryCard;
