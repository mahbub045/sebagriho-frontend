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
import {
  Calendar,
  Droplet,
  Mail,
  Map,
  Phone,
  Stethoscope,
  User,
} from 'lucide-react';
import Link from 'next/link';

const AppointmentPatientInfoCard: React.FC<PatientInfoCardProps> = ({
  patient,
}) => {
  const fullName =
    `${patient?.user?.first_name} ${patient?.user?.last_name}`.trim();

  const age =
    patient?.age || calculateAge(patient?.user?.date_of_birth) || null;

  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex flex-col items-center gap-3 border-b p-6 text-center'>
        <Avatar className='border-border/60 h-20 w-20 border'>
          <AvatarImage
            src={patient?.user?.avatar ?? undefined}
            alt={fullName}
          />

          <AvatarFallback className='bg-primary/5 text-primary text-xl font-semibold'>
            {getInitials(patient?.user?.first_name, patient?.user?.last_name)}
          </AvatarFallback>
        </Avatar>

        <div className='flex flex-col items-center gap-0.5'>
          <span className='text-base font-semibold'>{fullName}</span>
          <small>#{patient.serial_number}</small>
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
              {patient?.user?.gender ? (
                formatChoiceFieldValue(patient?.user?.gender)
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
              {patient?.user?.date_of_birth ? (
                formatDate(patient?.user?.date_of_birth)
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
              {patient?.user?.phone ? (
                patient?.user?.phone
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
              {patient?.user?.email ? (
                patient?.user?.email
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

            {patient?.user?.blood_group ? (
              <Badge
                variant='outline'
                className='mt-0.5 text-[10px] font-medium'
              >
                {patient?.user?.blood_group}
              </Badge>
            ) : (
              <p className='text-muted-foreground truncate italic'>
                Not recorded
              </p>
            )}
          </div>
        </div>

        {/* Miasm Type */}
        <div className='flex items-center gap-2'>
          <Stethoscope className='text-danger h-3.5 w-3.5 shrink-0' />

          <div className='min-w-0'>
            <p className='text-muted-foreground'>Miasm Type</p>

            {patient?.miasm_type ? (
              <span className='mt-0.5 text-[10px] font-medium'>
                {formatChoiceFieldValue(patient?.miasm_type)}
              </span>
            ) : (
              <p className='text-muted-foreground truncate italic'>
                Not recorded
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className='flex items-center gap-2'>
          <Map className='text-danger h-3.5 w-3.5 shrink-0' />

          <div className='min-w-0'>
            <p className='text-muted-foreground'>Address</p>

            {patient?.address ? (
              <span className='mt-0.5 truncate text-[10px] font-medium'>
                {formatChoiceFieldValue(patient?.address)}
              </span>
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

export default AppointmentPatientInfoCard;
