import { Card } from '@/components/ui/card';
import { OrganizationDetail } from '@/types/superAdmin/Organizations/OrganizationsType';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';

type Props = {
  organization: OrganizationDetail;
};

const InfoRow = ({
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
        <p className='text-muted-foreground/60 text-sm italic'>Not provided</p>
      )}
    </div>
  </div>
);

const OrganizationAboutCard: React.FC<Props> = ({ organization }) => {
  return (
    <Card className='border-border/60 p-5'>
      <h2 className='text-sm font-semibold'>About</h2>

      {organization.description ? (
        <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
          {organization.description}
        </p>
      ) : (
        <p className='text-muted-foreground/60 mt-2 text-sm italic'>
          No description provided.
        </p>
      )}

      <div className='border-border/60 mt-4 border-t' />

      <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <InfoRow
          icon={<Mail className='h-4 w-4' />}
          iconClassName='text-primary'
          label='Email'
          value={organization.email}
        />
        <InfoRow
          icon={<Phone className='h-4 w-4' />}
          iconClassName='text-secondary'
          label='Phone'
          value={organization.phone}
        />
        <InfoRow
          icon={<Globe className='h-4 w-4' />}
          iconClassName='text-success'
          label='Website'
          value={organization.website}
        />
        <InfoRow
          icon={<MapPin className='h-4 w-4' />}
          iconClassName='text-info'
          label='Address'
          value={organization.address}
        />
      </div>
    </Card>
  );
};

export default OrganizationAboutCard;
