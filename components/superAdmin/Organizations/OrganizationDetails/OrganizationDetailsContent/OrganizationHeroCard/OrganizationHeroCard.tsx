import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  ORGANIZATION_STATUS_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
} from '@/data/common/ChoiceFields';
import { statusStyles } from '@/data/superAdmin/Organizations/OrganizationsData';
import { OrganizationDetail } from '@/types/superAdmin/Organizations/OrganizationsType';
import { formatDateAndTime, getInitials } from '@/utils/formatters';
import { Building2, Globe } from 'lucide-react';
import Image from 'next/image';

type Props = {
  organization: OrganizationDetail;
  status: string;
  joinedAt: string;
  uid: string;
};

const OrganizationHeroCard: React.FC<Props> = ({
  organization,
  status,
  joinedAt,
}) => {
  const statusClass = statusStyles[status] ?? statusStyles.INACTIVE;
  const typeLabel =
    ORGANIZATION_TYPE_OPTIONS.find(
      (option) => option.value === organization.organization_type,
    )?.label ?? organization.organization_type;
  const statusLabel =
    ORGANIZATION_STATUS_OPTIONS.find((option) => option.value === status)
      ?.label ?? status;

  const url = `https://${organization.subdomain}${process.env.NEXT_PUBLIC_COOKIE_DOMAIN}`;

  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='flex flex-col gap-4 p-5 sm:flex-row sm:items-start'>
        <div className='bg-primary/5 text-primary relative h-16 w-28 shrink-0 overflow-hidden rounded-lg shadow-sm'>
          {organization.logo ? (
            <Image
              src={organization.logo}
              alt={organization.name}
              fill
              className='object-cover'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-xl font-semibold'>
              {getInitials(organization.name)}
            </div>
          )}
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-lg font-semibold'>{organization.name}</h1>
            <Badge
              variant='outline'
              className={`text-[11px] font-medium ${statusClass}`}
            >
              {statusLabel}
            </Badge>
          </div>
          <p className='text-muted-foreground mt-1 flex items-center gap-1.5 text-sm'>
            <Building2 className='text-primary h-3.5 w-3.5' />
            {typeLabel}
          </p>
        </div>
      </div>

      <div className='border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-2 border-t px-5 py-3 text-xs'>
        <span className='text-muted-foreground'>
          Joined {formatDateAndTime(joinedAt)}
        </span>
        <span className='flex items-center'>
          <Globe className='text-primary h-3.5 w-3.5' />
          <a
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary ml-1 underline'
          >
            {url}
          </a>
        </span>
      </div>
    </Card>
  );
};

export default OrganizationHeroCard;
