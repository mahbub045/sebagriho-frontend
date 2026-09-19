'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { PatientDetailsCardProps } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { Edit, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import EditPatientContactDetailsDialog from '../../Dialogs/EditPatientContactDetailsDialog';

const PatientContactCard: React.FC<PatientDetailsCardProps> = ({ patient }) => {
  const { dict } = useTranslation();
  const [isOpenEditPatientDialog, setIsOpenEditPatientDialog] = useState(false);
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center justify-between gap-2 border-b p-4'>
        <div className='flex items-center gap-2'>
          <Phone className='text-info h-4 w-4' />
          <h3 className='text-sm font-semibold'>
            {dict.patients.detail.contactCard.title}
          </h3>
        </div>
        <Button
          size='sm'
          variant='default'
          onClick={() => setIsOpenEditPatientDialog(true)}
        >
          <Edit />
          {dict.common.edit}
        </Button>
      </div>
      <div className='flex flex-col gap-3 p-4 text-xs'>
        <div className='flex items-center gap-2'>
          <Phone className='text-success h-3.5 w-3.5 shrink-0' />
          <div className='min-w-0'>
            <p className='text-muted-foreground'>
              {dict.patients.detail.contactCard.phone}
            </p>
            <p className='truncate font-medium'>
              {patient.user.phone ?? dict.patients.detail.contactCard.notProvided}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Mail className='text-primary h-3.5 w-3.5 shrink-0' />
          <div className='min-w-0'>
            <p className='text-muted-foreground'>
              {dict.patients.detail.contactCard.email}
            </p>
            <p className='truncate font-medium'>
              {patient.user.email ?? dict.patients.detail.contactCard.notProvided}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <MapPin className='text-secondary h-3.5 w-3.5 shrink-0' />
          <div className='min-w-0'>
            <p className='text-muted-foreground'>
              {dict.patients.detail.contactCard.address}
            </p>
            <p className='truncate font-medium'>
              {patient.address ?? dict.patients.detail.contactCard.notProvided}
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
