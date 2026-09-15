import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PatientDetailsCardProps } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { Edit, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import EditPatientContactDetailsDialog from '../../Dialogs/EditPatientContactDetailsDialog';

const PatientContactCard: React.FC<PatientDetailsCardProps> = ({ patient }) => {
  const [isOpenEditPatientDialog, setIsOpenEditPatientDialog] = useState(false);
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center justify-between gap-2 border-b p-4'>
        <div className='flex items-center gap-2'>
          <Phone className='text-info h-4 w-4' />
          <h3 className='text-sm font-semibold'>Contact Details</h3>
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
        <div className='flex items-center gap-2'>
          <Phone className='text-success h-3.5 w-3.5 shrink-0' />
          <div className='min-w-0'>
            <p className='text-muted-foreground'>Phone</p>
            <p className='truncate font-medium'>
              {patient.user.phone ?? 'Not provided'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Mail className='text-primary h-3.5 w-3.5 shrink-0' />
          <div className='min-w-0'>
            <p className='text-muted-foreground'>Email</p>
            <p className='truncate font-medium'>
              {patient.user.email ?? 'Not provided'}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <MapPin className='text-secondary h-3.5 w-3.5 shrink-0' />
          <div className='min-w-0'>
            <p className='text-muted-foreground'>Address</p>
            <p className='truncate font-medium'>
              {patient.address ?? 'Not provided'}
            </p>
          </div>
        </div>
      </div>
      <EditPatientContactDetailsDialog
        isOpen={isOpenEditPatientDialog}
        onClose={() => setIsOpenEditPatientDialog(false)}
        patientInfo={patient}
      />
    </Card>
  );
};

export default PatientContactCard;
