import { Card } from '@/components/ui/card';
import { Patient } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { Mail, MapPin, Phone } from 'lucide-react';

interface Props {
  patient: Patient;
}

const PatientContactCard: React.FC<Props> = ({ patient }) => {
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center gap-2 border-b p-4'>
        <Phone className='text-info h-4 w-4' />
        <h3 className='text-sm font-semibold'>Contact Details</h3>
      </div>
      <div className='flex flex-col gap-3 p-4 text-xs'>
        <div className='flex items-center gap-2'>
          <Phone className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
          <div className='min-w-0'>
            <p className='text-muted-foreground'>Phone</p>
            <p className='truncate font-medium'>
              {patient.user.phone ?? 'Not provided'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Phone className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
          <div className='min-w-0'>
            <p className='text-muted-foreground'>Relative Phone</p>
            <p className='truncate font-medium'>
              {patient.relative_phone ?? 'Not provided'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Mail className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
          <div className='min-w-0'>
            <p className='text-muted-foreground'>Email</p>
            <p className='truncate font-medium'>
              {patient.user.email ?? 'Not provided'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <MapPin className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
          <div className='min-w-0'>
            <p className='text-muted-foreground'>Address</p>
            <p className='truncate font-medium'>
              {patient.address ?? 'Not provided'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PatientContactCard;