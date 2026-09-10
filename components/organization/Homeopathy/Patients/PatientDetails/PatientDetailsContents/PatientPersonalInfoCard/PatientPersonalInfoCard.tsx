import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PatientDetailsCardProps } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { formatChoiceFieldValue, formatDate } from '@/utils/formatters';
import { Edit, User } from 'lucide-react';
import { useState } from 'react';
import EditPatientPersonalInfoDialog from '../../Dialogs/EditPatientPersonalInfoDialog';

const PatientPersonalInfoCard: React.FC<PatientDetailsCardProps> = ({
  patient,
}) => {
  const [isOpenEditPatientDialog, setIsOpenEditPatientDialog] = useState(false);
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center justify-between gap-2 border-b p-4'>
        <div className='flex items-center gap-2'>
          <User className='text-primary h-4 w-4' />
          <h3 className='text-sm font-semibold'>Personal Information</h3>
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
      <div className='flex flex-col gap-3 p-4 text-xs'>
        <div>
          <p className='text-muted-foreground'>Age / Gender</p>
          <p className='font-medium'>
            {patient.age ?? 'N/A'} years •{' '}
            {patient.user.gender
              ? formatChoiceFieldValue(patient.user.gender)
              : 'N/A'}
          </p>
        </div>
        <div>
          <p className='text-muted-foreground'>Date of Birth</p>
          <p className='font-medium'>
            {patient.user.date_of_birth
              ? formatDate(patient.user.date_of_birth)
              : 'N/A'}
          </p>
        </div>
      </div>
      <EditPatientPersonalInfoDialog
        isOpen={isOpenEditPatientDialog}
        onClose={() => setIsOpenEditPatientDialog(false)}
        patientInfo={patient}
      />
    </Card>
  );
};

export default PatientPersonalInfoCard;
