'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { statusStyles } from '@/data/superAdmin/Organizations/OrganizationsData';
import { useGetOrganizationsQuery } from '@/lib/services/endpoints/superAdmin/Organizations/OrganizationsApi';
import { OrganizationCardProps } from '@/types/superAdmin/Organizations/OrganizationsType';
import { PAGE_LIMIT } from '@/utils/constants';
import { formatDateAndTime, getInitials } from '@/utils/formatters';
import { Building2, Globe, Mail, Phone, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const OrganizationList: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetOrganizationsQuery({
    page,
    page_size: PAGE_LIMIT,
  });

  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / PAGE_LIMIT));

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className='bg-background h-55 animate-pulse rounded-xl'
          />
        ))}
      </div>
    );
  }

  if (!data?.results?.length) {
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
    <div className='flex flex-col gap-4'>
      <div
        className={`mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 ${
          isFetching ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        {data.results.map((item: OrganizationCardProps) => {
          const { organization, user, status, joined_at, uid } = item;
          const statusClass = statusStyles[status] ?? statusStyles.INACTIVE;

          return (
            <Link key={uid} href={`/super-admin/organizations/${uid}`}>
              <Card
                glow
                key={uid}
                className='border-border/60 hover:border-border flex flex-col gap-0 overflow-hidden p-0 shadow-sm transition-colors'
              >
                {/* Identity block */}
                <div className='flex items-start gap-3 p-4'>
                  <div className='bg-primary/5 text-primary relative h-10 w-20 shrink-0 overflow-hidden rounded-lg shadow-sm'>
                    {organization.logo ? (
                      <Image
                        src={organization.logo}
                        alt={organization.name}
                        fill
                        className='object-cover'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center text-lg font-semibold'>
                        {getInitials(organization.name)}
                      </div>
                    )}
                  </div>

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

                <div className='border-border/60 mt-4 border-t' />

                {/* Meta grid */}
                <div className='grid grid-cols-1 gap-2.5 p-4 text-xs'>
                  <div className='text-muted-foreground flex items-center gap-2'>
                    <Mail className='text-primary h-3.5 w-3.5 shrink-0' />
                    {organization.email ? (
                      <span className='truncate'>{organization.email}</span>
                    ) : (
                      <span className='truncate italic'>Not provided</span>
                    )}
                  </div>
                  <div className='text-muted-foreground flex items-center gap-2'>
                    <Phone className='text-secondary h-3.5 w-3.5 shrink-0' />
                    {organization.phone ? (
                      <span className='truncate'>{organization.phone}</span>
                    ) : (
                      <span className='truncate italic'>Not provided</span>
                    )}
                  </div>

                  <div className='text-muted-foreground flex items-center gap-2'>
                    <Globe className='text-success h-3.5 w-3.5 shrink-0' />
                    {organization.website ? (
                      <span className='truncate'>{organization.website}</span>
                    ) : (
                      <span className='truncate italic'>Not provided</span>
                    )}
                  </div>
                </div>

                <div className='border-border/60 bg-muted/30 flex items-center justify-between border-t px-4 py-3'>
                  <div className='flex items-center gap-2 text-xs'>
                    <User className='text-info h-3.5 w-3.5' />
                    <span className='font-medium'>
                      {user.first_name} {user.last_name}
                    </span>
                  </div>
                  <span className='text-muted-foreground text-xs'>
                    Joined {formatDateAndTime(joined_at)}
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className='flex items-center justify-between'>
        {(data?.count ?? 0) > 0 && (
          <p className='text-muted-foreground text-sm whitespace-nowrap'>
            Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
            {Math.min(page * PAGE_LIMIT, data?.count ?? 0)} of{' '}
            {data?.count ?? 0} Organizations
          </p>
        )}
        {totalPages > 1 && (
          <Pagination className='justify-end'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage((p) => p - 1)}
                  aria-disabled={page === 1}
                  className={
                    page === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((p, i) =>
                p === '...' ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => setPage(p as number)}
                      className='cursor-pointer'
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => page < totalPages && setPage((p) => p + 1)}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default OrganizationList;
