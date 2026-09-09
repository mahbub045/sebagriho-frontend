import { Card } from '@/components/ui/card';
import { Patient } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { formatChoiceFieldValue, formatDateAndTime } from '@/utils/formatters';
import { User } from 'lucide-react';

interface Props {
  patient: Patient;
}

const PatientPersonalInfoCard: React.FC<Props> = ({ patient }) => {
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center gap-2 border-b p-4'>
        <User className='text-primary h-4 w-4' />
        <h3 className='text-sm font-semibold'>Personal Information</h3>
      </div>
      <div className='flex flex-col gap-3 p-4 text-xs'>
        <div>
          <p className='text-muted-foreground'>Full Name</p>
          <p className='font-medium'>
            {patient.user.first_name} {patient.user.last_name}
          </p>
        </div>
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
              ? formatDateAndTime(patient.user.date_of_birth)
              : 'N/A'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PatientPersonalInfoCard;
