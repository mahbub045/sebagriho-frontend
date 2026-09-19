'use client';

import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/useTranslation';
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
  notProvidedText,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  label: string;
  value?: string | null;
  notProvidedText: string;
}) => (
  <div className='flex items-start gap-3'>
    <div className={`mt-0.5 shrink-0 ${iconClassName}`}>{icon}</div>
    <div className='min-w-0'>
      <p className='text-muted-foreground text-xs'>{label}</p>
      {value ? (
        <p className='truncate text-sm'>{value}</p>
      ) : (
        <p className='text-muted-foreground/60 text-sm italic'>
          {notProvidedText}
        </p>
      )}
    </div>
  </div>
);

const OrganizationAboutCard: React.FC<Props> = ({ organization }) => {
  const { dict } = useTranslation();

  return (
    <Card className='border-border/60 p-5 shadow-sm'>
      <h2 className='text-sm font-semibold'>
        {dict.organizations.detail.aboutCard.title}
      </h2>

      {organization.description ? (
        <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
          {organization.description}
        </p>
      ) : (
        <p className='text-muted-foreground/60 mt-2 text-sm italic'>
          {dict.organizations.detail.aboutCard.noDescription}
        </p>
      )}

      <div className='border-border/60 mt-4 border-t' />

      <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <InfoRow
          icon={<Mail className='h-4 w-4' />}
          iconClassName='text-primary'
          label={dict.organizations.detail.aboutCard.email}
          value={organization.email}
          notProvidedText={dict.organizations.detail.aboutCard.notProvided}
        />
        <InfoRow
          icon={<Phone className='h-4 w-4' />}
          iconClassName='text-secondary'
          label={dict.organizations.detail.aboutCard.phone}
          value={organization.phone}
          notProvidedText={dict.organizations.detail.aboutCard.notProvided}
        />
        <InfoRow
          icon={<Globe className='h-4 w-4' />}
          iconClassName='text-success'
          label={dict.organizations.detail.aboutCard.website}
          value={organization.website}
          notProvidedText={dict.organizations.detail.aboutCard.notProvided}
        />
        <InfoRow
          icon={<MapPin className='h-4 w-4' />}
          iconClassName='text-info'
          label={dict.organizations.detail.aboutCard.address}
          value={organization.address}
          notProvidedText={dict.organizations.detail.aboutCard.notProvided}
        />
      </div>
    </Card>
  );
};

export default OrganizationAboutCard;
