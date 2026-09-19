'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { PatientDetailsCardProps } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { formatChoiceFieldValue } from '@/utils/formatters';
import { Edit, User } from 'lucide-react';
import { useState } from 'react';
import EditPatientPersonalInfoDialog from '../../Dialogs/EditPatientPersonalInfoDialog';

const PatientPersonalInfoCard: React.FC<PatientDetailsCardProps> = ({
  patient,
}) => {
  const { dict, locale } = useTranslation();
  const [isOpenEditPatientDialog, setIsOpenEditPatientDialog] = useState(false);
  const notAvailable = dict.patients.detail.personalInfoCard.notAvailable;
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center justify-between gap-2 border-b p-4'>
        <div className='flex items-center gap-2'>
          <User className='text-primary h-4 w-4' />
          <h3 className='text-sm font-semibold'>
            {dict.patients.detail.personalInfoCard.title}
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
        <div>
          <p className='text-muted-foreground'>
            {dict.patients.detail.personalInfoCard.ageGenderLabel}
          </p>
          <p className='font-medium'>
            {dict.patients.detail.personalInfoCard.ageGenderValue
              .replace('{age}', patient.age !== null ? String(patient.age) : notAvailable)
              .replace(
                '{gender}',
                patient.user.gender
                  ? formatChoiceFieldValue(patient.user.gender, locale)
                  : notAvailable,
              )}
          </p>
        </div>
        <div>
          <p className='text-muted-foreground'>
            {dict.patients.detail.personalInfoCard.bloodGroup}
          </p>
          <p className='font-medium'>
            {patient.user.blood_group
              ? formatChoiceFieldValue(patient.user.blood_group, locale)
              : notAvailable}
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
