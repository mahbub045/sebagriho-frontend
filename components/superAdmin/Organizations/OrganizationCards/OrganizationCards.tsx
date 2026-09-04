'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { statusStyles } from '@/data/superAdmin/Organizations/OrganizationsData';
import { useGetOrganizationsQuery } from '@/lib/services/endpoints/superAdmin/Organizations/OrganizationsApi';
import { OrganizationCardProps } from '@/types/superAdmin/Organizations/OrganizationsType';
import { formatDateAndTime, getInitials } from '@/utils/formatters';
import { Building2, Globe, Mail, Phone, User } from 'lucide-react';

const OrganizationCards: React.FC = () => {
  const { data: organizationData, isLoading } =
    useGetOrganizationsQuery(undefined);

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='bg-muted/40 h-55 animate-pulse rounded-xl' />
        ))}
      </div>
    );
  }

  if (!organizationData?.results?.length) {
    return (
      <div className='border-danger mt-2 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
        <Building2 className='text-muted-foreground/40 h-10 w-10' />
        <p className='mt-3 text-sm font-medium'>No organizations yet</p>
        <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
          Organizations will show up here once someone joins or creates one.
        </p>
      </div>
    );
  }

  return (
    <div className='mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
      {organizationData.results.map((item: OrganizationCardProps) => {
        const { organization, user, status, joined_at, uid } = item;
        const statusClass = statusStyles[status] ?? statusStyles.INACTIVE;

        return (
          <Card
            key={uid}
            className='border-border/60 hover:border-border flex flex-col gap-0 overflow-hidden p-0 transition-colors'
          >
            {/* Identity block */}
            <div className='flex items-start gap-3 p-4'>
              <Avatar className='border-border h-11 w-11 rounded-lg border'>
                <AvatarImage src={organization.logo ?? undefined} />
                <AvatarFallback className='bg-primary/5 text-primary rounded-lg text-sm font-semibold'>
                  {getInitials(organization.name)}
                </AvatarFallback>
              </Avatar>

              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm leading-tight font-semibold'>
                  {organization.name}
                </p>
                <p className='text-muted-foreground mt-0.5 text-xs capitalize'>
                  {organization.organization_type.toLowerCase()}
                </p>
              </div>

              <Badge
                variant='outline'
                className={`shrink-0 text-[11px] font-medium ${statusClass}`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </Badge>
            </div>

            {organization.description && (
              <p className='text-muted-foreground line-clamp-2 px-4 text-xs leading-relaxed'>
                {organization.description}
              </p>
            )}

            <div className='border-border/60 mt-4 border-t' />

            {/* Meta grid */}
            <div className='grid grid-cols-1 gap-2.5 p-4 text-xs'>
              <div className='text-muted-foreground flex items-center gap-2'>
                <Mail className='h-3.5 w-3.5 shrink-0' />
                <span className='truncate'>{organization.email}</span>
              </div>
              <div className='text-muted-foreground flex items-center gap-2'>
                <Phone className='h-3.5 w-3.5 shrink-0' />
                <span className='truncate'>{organization.phone}</span>
              </div>
              {organization.website && (
                <div className='text-muted-foreground flex items-center gap-2'>
                  <Globe className='h-3.5 w-3.5 shrink-0' />
                  <span className='truncate'>{organization.website}</span>
                </div>
              )}
            </div>

            <div className='border-border/60 bg-muted/30 flex items-center justify-between border-t px-4 py-3'>
              <div className='flex items-center gap-2 text-xs'>
                <User className='text-muted-foreground h-3.5 w-3.5' />
                <span className='font-medium'>
                  {user.first_name} {user.last_name}
                </span>
              </div>
              <span className='text-muted-foreground text-xs'>
                Joined {formatDateAndTime(joined_at)}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default OrganizationCards;
