import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  BLOOD_GROUP_OPTIONS,
  GENDER_OPTIONS,
} from '@/data/common/ChoiceFields';
import { OrganizationOwner } from '@/types/superAdmin/Organizations/OrganizationsType';
import { formatDateAndTime, getInitials } from '@/utils/formatters';
import { CreditCard, Droplet, Mail, Phone } from 'lucide-react';

type Props = {
  user: OrganizationOwner;
};

const DetailRow = ({
  icon,
  iconClassName,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  label: string;
  value?: string | null;
}) => (
  <div className='flex items-start gap-3'>
    <div className={`mt-0.5 shrink-0 ${iconClassName}`}>{icon}</div>
    <div className='min-w-0'>
      <p className='text-muted-foreground text-xs'>{label}</p>
      {value ? (
        <p className='truncate text-sm'>{value}</p>
      ) : (
        <p className='text-muted-foreground/60 text-sm'>—</p>
      )}
    </div>
  </div>
);

const OrganizationOwnerCard: React.FC<Props> = ({ user }) => {
  const fullName = `${user.first_name} ${user.last_name}`.trim();
  const genderLabel =
    GENDER_OPTIONS.find((option) => option.value === user.gender)?.label ??
    user.gender;
  const bloodGroupLabel = user.blood_group
    ? (BLOOD_GROUP_OPTIONS.find((option) => option.value === user.blood_group)
        ?.label ?? user.blood_group)
    : null;

  return (
    <Card className='border-border/60 p-5'>
      <div className='flex items-center gap-3'>
        <Avatar className='h-12 w-12'>
          <AvatarImage src={user.avatar ?? undefined} alt={fullName} />
          <AvatarFallback className='bg-primary/5 text-primary text-sm font-semibold'>
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>

        <div className='min-w-0'>
          <p className='truncate text-sm font-semibold'>{fullName}</p>
          <Badge variant='outline' className='mt-1 text-[11px] font-medium'>
            Owner
          </Badge>
        </div>
      </div>

      <div className='border-border/60 mt-4 border-t' />

      <div className='mt-9! space-y-4'>
        <DetailRow
          icon={<Mail className='h-4 w-4' />}
          iconClassName='text-primary'
          label='Email'
          value={user.email}
        />
        <DetailRow
          icon={<Phone className='h-4 w-4' />}
          iconClassName='text-secondary'
          label='Phone'
          value={user.phone}
        />
        <DetailRow
          icon={<Droplet className='h-4 w-4' />}
          iconClassName='text-danger'
          label='Blood group'
          value={bloodGroupLabel}
        />
        <DetailRow
          icon={<CreditCard className='h-4 w-4' />}
          iconClassName='text-info'
          label='NID'
          value={user.nid}
        />
      </div>

      <div className='border-border/60 mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-xs'>
        <div>
          <p className='text-muted-foreground'>Gender</p>
          <p className='mt-1'>{genderLabel}</p>
        </div>
        <div>
          <p className='text-muted-foreground'>Date of birth</p>
          <p className='mt-0.5'>
            {user.date_of_birth ? formatDateAndTime(user.date_of_birth) : '—'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default OrganizationOwnerCard;
