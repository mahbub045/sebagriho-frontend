import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { STATUS_STYLES } from '@/data/Organization/Homeopathy/PatientsData';
import { Patient } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import {
  formatChoiceFieldValue,
  formatDateAndTime,
  getInitials,
} from '@/utils/formatters';
import { CalendarDays, Edit } from 'lucide-react';
import { useState } from 'react';
import UpdatePatientIdentityDailog from '../../Dialogs/EditPatientIdentityDailog';

interface Props {
  patient: Patient;
}

const PatientIdentityCard: React.FC<Props> = ({ patient }) => {
  const statusClass = STATUS_STYLES[patient.status] ?? STATUS_STYLES.INACTIVE;
  const [isOpenEditPatientDialog, setIsOpenEditPatientDialog] = useState(false);

  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='flex items-start gap-4 p-5'>
        <Avatar className='h-16 w-16'>
          <AvatarImage
            src={patient.user.avatar ?? undefined}
            alt={patient.user.name}
          />
          <AvatarFallback className='bg-primary/5 text-primary text-xl font-semibold'>
            {getInitials(patient.user.name)}
          </AvatarFallback>
        </Avatar>

        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <h2 className='text-lg font-semibold'>
                {patient.user.first_name} {patient.user.last_name}
              </h2>
              <Badge
                variant='outline'
                className={`text-[11px] font-medium ${statusClass}`}
              >
                {formatChoiceFieldValue(patient.status)}
              </Badge>
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsOpenEditPatientDialog(true)}
            >
              <Edit />
              Edit
            </Button>
          </div>
          <div className='text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-sm'>
            <Badge>Serial No: {patient.serial_number}</Badge>
            {patient.old_serial_number && (
              <>
                <span className='text-muted-foreground/50'>•</span>
                <Badge variant='secondary'>
                  Old Serial: {patient.old_serial_number}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
      <div className='border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-2 border-t px-5 py-3 text-xs'>
        <div className='flex items-center gap-2'>
          <CalendarDays className='text-muted-foreground h-3.5 w-3.5' />
          <span className='text-muted-foreground'>
            Created: {formatDateAndTime(patient.created_at)}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <CalendarDays className='text-muted-foreground h-3.5 w-3.5' />
          <span className='text-muted-foreground'>
            Updated: {formatDateAndTime(patient.updated_at)}
          </span>
        </div>
      </div>
      <UpdatePatientIdentityDailog
        isOpen={isOpenEditPatientDialog}
        onClose={() => setIsOpenEditPatientDialog(false)}
        patientInfo={patient}
      />
    </Card>
  );
};

export default PatientIdentityCard;
