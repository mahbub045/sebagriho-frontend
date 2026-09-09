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
import {
  MIASM_STYLES,
  STATUS_STYLES,
} from '@/data/Organization/Homeopathy/PatientsData';
import { useGetPatientsQuery } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';
import { Patient } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { PAGE_LIMIT } from '@/utils/constants';
import { formatDateAndTime, getInitials } from '@/utils/formatters';
import {
  CalendarDays,
  FileText,
  MapPin,
  Phone,
  Stethoscope,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const PatientList: React.FC = () => {
  const [page, setPage] = useState(1);
  const {
    data: patients,
    isLoading,
    isFetching,
    isError,
  } = useGetPatientsQuery({ page, page_size: PAGE_LIMIT });

  const totalPages = Math.max(
    1,
    Math.ceil((patients?.count ?? 0) / PAGE_LIMIT),
  );

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
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='bg-background h-60 animate-pulse rounded-xl'
          />
        ))}
      </div>
    );
  }
  if (isError) {
    return (
      <div className='border-danger mt-2 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
        <Stethoscope className='text-danger/50 h-10 w-10' />
        <p className='mt-3 text-sm font-medium'> Failed to load patients </p>
        <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
          Something went wrong while loading the patient list.
        </p>
      </div>
    );
  }
  if (!patients?.results?.length) {
    return (
      <div className='border-danger mt-2 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
        <User className='text-muted-foreground/40 h-10 w-10' />
        <p className='mt-3 text-sm font-medium'> No patients yet </p>
        <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
          Patients will appear here once they are added to the system.
        </p>
      </div>
    );
  }
  return (
    <div className='flex flex-col gap-4'>
      <div
        className={`mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 ${isFetching ? 'pointer-events-none opacity-60' : ''}`}
      >
        {patients.results.map((patient: Patient) => {
          const statusClass =
            STATUS_STYLES[patient.status] ?? STATUS_STYLES.INACTIVE;

          const miasmClass =
            (patient.miasm_type && MIASM_STYLES[patient.miasm_type]) ??
            'border-border bg-muted';

          return (
            <Link
              key={patient.uid}
              href={`/organization/homeopathy/patients/${patient.uid}`}
            >
              <Card
                glow
                className='border-border/60 hover:border-border flex h-full flex-col gap-0 overflow-hidden p-0 shadow-sm transition-colors'
              >
                {/* Patient identity */}
                <div className='flex items-start gap-3 p-4'>
                  <div className='bg-primary/5 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold'>
                    {getInitials(patient.user.name)}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <p className='truncate text-sm leading-tight font-semibold'>
                        {patient.user.name}
                      </p>
                    </div>
                    <div className='mt-1 flex items-center gap-2'>
                      <span className='text-muted-foreground text-xs'>
                        #{patient.serial_number}
                      </span>
                      {patient.old_serial_number && (
                        <>
                          <span className='text-muted-foreground/50'>• </span>
                          <span className='text-muted-foreground text-xs'>
                            Old #{patient.old_serial_number}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant='outline'
                    className={`shrink-0 text-[11px] font-medium ${statusClass}`}
                  >
                    {patient.status.charAt(0) +
                      patient.status.slice(1).toLowerCase()}
                  </Badge>
                </div>
                <div className='border-border/60 border-t' />
                {/* Patient meta */}
                <div className='grid grid-cols-2 gap-3 p-4 text-xs'>
                  <div className='flex items-center gap-2'>
                    <User className='text-primary h-3.5 w-3.5 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-muted-foreground'>Age / Gender </p>
                      <p className='truncate font-medium'>
                        {patient.age ?? 'N/A'} years •{' '}
                        {patient.user.gender
                          ? patient.user.gender.charAt(0) +
                            patient.user.gender.slice(1).toLowerCase()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Stethoscope className='text-secondary h-3.5 w-3.5 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-muted-foreground'> Miasm </p>
                      <Badge
                        variant='outline'
                        className={`mt-0.5 text-[10px] font-medium ${miasmClass}`}
                      >
                        {patient.miasm_type
                          ? patient.miasm_type.charAt(0) +
                            patient.miasm_type.slice(1).toLowerCase()
                          : 'Not specified'}
                      </Badge>
                    </div>
                  </div>
                  <div className='col-span-2 flex items-center gap-2'>
                    <Phone className='text-info h-3.5 w-3.5 shrink-0' />
                    {patient.user.phone || patient.relative_phone ? (
                      <div className='min-w-0'>
                        <p className='text-muted-foreground'> Contact </p>
                        <p className='truncate font-medium'>
                          {patient.user.phone || patient.relative_phone}
                        </p>
                      </div>
                    ) : (
                      <span className='text-muted-foreground italic'>
                        Not provided
                      </span>
                    )}
                  </div>
                  <div className='col-span-2 flex items-center gap-2'>
                    <MapPin className='text-success h-3.5 w-3.5 shrink-0' />
                    {patient.address ? (
                      <span className='text-muted-foreground truncate'>
                        {patient.address}
                      </span>
                    ) : (
                      <span className='text-muted-foreground italic'>
                        Address not provided
                      </span>
                    )}
                  </div>
                </div>
                {/* Footer */}
                <div className='border-border/60 bg-muted/30 mt-auto flex items-center justify-between border-t px-4 py-3'>
                  <div className='flex items-center gap-2 text-xs'>
                    <FileText className='text-warning h-3.5 w-3.5' />
                    <span className='font-medium'>
                      {patient.files?.length ?? 0}{' '}
                      {patient.files?.length === 1 ? 'File' : 'Files'}
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <CalendarDays className='text-muted-foreground h-3.5 w-3.5' />
                    <span className='text-muted-foreground text-xs'>
                      {formatDateAndTime(patient.created_at)}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
      {/* Pagination */}
      <div className='flex items-center justify-between'>
        {(patients?.count ?? 0) > 0 && (
          <p className='text-muted-foreground text-sm whitespace-nowrap'>
            Showing {(page - 1) * PAGE_LIMIT + 1} to
            {Math.min(page * PAGE_LIMIT, patients?.count ?? 0)} of
            {patients?.count ?? 0} Patients
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
              {getPageNumbers().map((p, index) =>
                p === '...' ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => setPage(p)}
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
export default PatientList;
