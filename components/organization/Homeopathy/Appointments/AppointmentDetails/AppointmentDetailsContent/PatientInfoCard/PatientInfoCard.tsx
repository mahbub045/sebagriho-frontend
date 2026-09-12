import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PatientInfoCardProps } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import {
  calculateAge,
  formatChoiceFieldValue,
  formatDate,
  getInitials,
} from '@/utils/formatters';
import { Calendar, Droplet, Mail, Phone, User } from 'lucide-react';
import Link from 'next/link';

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patient }) => {
  const fullName = `${patient.first_name} ${patient.last_name}`.trim();

  const age = calculateAge(patient.date_of_birth);

  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex flex-col items-center gap-3 border-b p-6 text-center'>
        <Avatar className='border-border/60 h-20 w-20 border'>
          <AvatarImage src={patient.avatar ?? undefined} alt={fullName} />

          <AvatarFallback className='bg-primary/5 text-primary text-xl font-semibold'>
            {getInitials(patient.first_name, patient.last_name)}
          </AvatarFallback>
        </Avatar>

        <div className='flex flex-col items-center gap-1'>
          <span className='text-base font-semibold'>{fullName}</span>
          <Link
            href={`/organization/homeopathy/patients/${patient.uid}`}
            className='text-primary text_decoration_underline text-xs font-medium'
          >
            View patient profile
          </Link>
        </div>
      </div>

      <div className='flex flex-col gap-4 p-4 text-xs'>
        {/* Age / Gender */}
        <div className='flex items-center gap-2'>
          <User className='text-primary h-3.5 w-3.5 shrink-0' />

          <div className='min-w-0'>
            <p className='text-muted-foreground'>Age / Gender</p>

            <p className='truncate font-medium'>
              {age !== null ? `${age} years` : 'N/A'} •{' '}
              {patient.gender ? (
                formatChoiceFieldValue(patient.gender)
              ) : (
                <small className='text-muted-foreground truncate italic'>
                  Not recorded
                </small>
              )}
            </p>
          </div>
        </div>

        {/* Date of birth */}
        <div className='flex items-center gap-2'>
          <Calendar className='text-secondary h-3.5 w-3.5 shrink-0' />

          <div className='min-w-0'>
            <p className='text-muted-foreground'>Date of Birth</p>

            <p className='truncate font-medium'>
              {patient.date_of_birth ? (
                formatDate(patient.date_of_birth)
              ) : (
                <small className='text-muted-foreground truncate italic'>
                  Not recorded
                </small>
              )}
            </p>
          </div>
        </div>

        {/* Phone */}
        <div className='flex items-center gap-2'>
          <Phone className='text-info h-3.5 w-3.5 shrink-0' />

          <div className='min-w-0'>
            <p className='text-muted-foreground'>Phone</p>

            <p className='truncate font-medium'>
              {patient.phone ? (
                patient.phone
              ) : (
                <small className='text-muted-foreground truncate italic'>
                  Not provided
                </small>
              )}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className='flex items-center gap-2'>
          <Mail className='text-warning h-3.5 w-3.5 shrink-0' />

          <div className='min-w-0'>
            <p className='text-muted-foreground'>Email</p>

            <p className='truncate font-medium'>
              {patient.email ? (
                patient.email
              ) : (
                <small className='text-muted-foreground truncate italic'>
                  Not provided
                </small>
              )}
            </p>
          </div>
        </div>

        {/* Blood group */}
        <div className='flex items-center gap-2'>
          <Droplet className='text-danger h-3.5 w-3.5 shrink-0' />

          <div className='min-w-0'>
            <p className='text-muted-foreground'>Blood Group</p>

            {patient.blood_group ? (
              <Badge
                variant='outline'
                className='mt-0.5 text-[10px] font-medium'
              >
                {patient.blood_group}
              </Badge>
            ) : (
              <p className='text-muted-foreground truncate italic'>
                Not recorded
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PatientInfoCard;
