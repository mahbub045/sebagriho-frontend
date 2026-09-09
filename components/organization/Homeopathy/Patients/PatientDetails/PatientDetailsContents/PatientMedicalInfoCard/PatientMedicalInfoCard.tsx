import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MIASM_STYLES } from '@/data/Organization/Homeopathy/PatientsData';
import { Patient } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { formatChoiceFieldValue } from '@/utils/formatters';
import { Stethoscope } from 'lucide-react';

interface Props {
  patient: Patient;
}

const PatientMedicalInfoCard: React.FC<Props> = ({ patient }) => {
  const miasmClass =
    (patient.miasm_type && MIASM_STYLES[patient.miasm_type]) ??
    'border-border bg-muted';

  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center gap-2 border-b p-4'>
        <Stethoscope className='text-secondary h-4 w-4' />
        <h3 className='text-sm font-semibold'>Medical Information</h3>
      </div>
      <div className='flex flex-col gap-3 p-4 text-xs'>
        <div>
          <p className='text-muted-foreground'>Miasm Type</p>
          <Badge
            variant='outline'
            className={`mt-1 text-[10px] font-medium ${miasmClass}`}
          >
            {patient.miasm_type
              ? formatChoiceFieldValue(patient.miasm_type)
              : 'Not specified'}
          </Badge>
        </div>
        <div>
          <p className='text-muted-foreground'>Habits</p>
          <p className='font-medium'>{patient.habits ?? 'N/A'}</p>
        </div>
      </div>
    </Card>
  );
};

export default PatientMedicalInfoCard;
