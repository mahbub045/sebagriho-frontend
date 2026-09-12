'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  APPOINTMENT_STATUS_OPTIONS,
  MIASM_TYPE_OPTIONS,
} from '@/data/common/ChoiceFields';
import { STATUS_STYLES } from '@/data/Organization/Homeopathy/Appointments/AppointmentsData';
import { useGetAppointmentsQuery } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import {
  Appointment,
  AppointmentStatus,
} from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { MiasmType } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { PAGE_LIMIT } from '@/utils/constants';
import { formatChoiceFieldValue, formatDateAndTime } from '@/utils/formatters';
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Search,
  SlidersHorizontal,
  Stethoscope,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const AppointmentList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [miasmType, setMiasmType] = useState<MiasmType | 'ALL'>('ALL');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const {
    data: appointments,
    isLoading,
    isFetching,
    isError,
  } = useGetAppointmentsQuery({
    page,
    page_size: PAGE_LIMIT,
    ...(search ? { search } : {}),
    ...(status !== 'ALL' ? { status } : {}),
    ...(miasmType !== 'ALL'
      ? { homeopathic_patient__miasm_type: miasmType }
      : {}),
  });

  const totalPages = Math.max(
    1,
    Math.ceil((appointments?.count ?? 0) / PAGE_LIMIT),
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

  const hasActiveFilters =
    search !== '' || status !== 'ALL' || miasmType !== 'ALL';

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatus('ALL');
    setMiasmType('ALL');
    setPage(1);
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* HEADER */}

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-xl font-semibold tracking-tight'>Appointments</h1>

          <p className='text-muted-foreground mt-1 text-sm'>
            View and manage all patient appointments in your organization.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}

      <Card className='border-border/60 flex flex-col gap-3 p-4 shadow-sm sm:flex-row sm:items-center'>
        <div className='text-muted-foreground hidden items-center gap-1.5 text-xs font-medium sm:flex'>
          <SlidersHorizontal className='h-3.5 w-3.5' />
        </div>

        {/* Search */}
        <div className='relative flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />

          <Input
            type='text'
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder='Search by patient name, symptoms...'
            className='pl-9!'
          />
        </div>

        {/* Status */}
        <Select
          items={APPOINTMENT_STATUS_OPTIONS}
          value={status}
          onValueChange={(value) => {
            setStatus(value as AppointmentStatus | 'ALL');
            setPage(1);
          }}
        >
          <SelectTrigger className='w-full cursor-pointer sm:w-40'>
            <SelectValue placeholder='Status' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='ALL'>All Status</SelectItem>

            {APPOINTMENT_STATUS_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Miasm (filters via patient relation) */}
        <Select
          items={MIASM_TYPE_OPTIONS}
          value={miasmType}
          onValueChange={(value) => {
            setMiasmType(value as MiasmType | 'ALL');
            setPage(1);
          }}
        >
          <SelectTrigger className='w-full cursor-pointer sm:w-40'>
            <SelectValue placeholder='Miasm Type' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='ALL'>All Miasm</SelectItem>

            {MIASM_TYPE_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <button
            type='button'
            onClick={clearFilters}
            className='border-danger/40 text-danger hover:bg-danger/10 flex cursor-pointer items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors'
          >
            <X className='h-3.5 w-3.5' />
            Clear filters
          </button>
        )}
      </Card>

      {isLoading && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='bg-background h-60 animate-pulse rounded-xl'
            />
          ))}
        </div>
      )}

      {/* ERROR */}

      {!isLoading && isError && (
        <div className='border-danger/40 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <Stethoscope className='text-danger/50 h-10 w-10' />

          <p className='mt-3 text-sm font-medium'>
            Failed to load appointments
          </p>

          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            Something went wrong while loading the appointment list.
          </p>
        </div>
      )}

      {/* EMPTY STATE */}

      {!isLoading && !isError && !appointments?.results?.length && (
        <div className='border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <ClipboardList className='text-muted-foreground/40 h-10 w-10' />

          <p className='mt-3 text-sm font-medium'>
            {hasActiveFilters
              ? 'No matching appointments'
              : 'No appointments yet'}
          </p>

          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            {hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'Appointments will appear here once they are created.'}
          </p>
        </div>
      )}

      {/* APPOINTMENT LIST */}

      {!isLoading &&
        !isError &&
        appointments?.results &&
        appointments.results.length > 0 && (
          <>
            <div
              className={`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 ${
                isFetching ? 'pointer-events-none opacity-60' : ''
              }`}
            >
              {appointments.results.map((appointment: Appointment) => {
                const statusClass =
                  STATUS_STYLES[appointment.status] ?? STATUS_STYLES.ACTIVE;

                const patientName =
                  `${appointment.patient.first_name} ${appointment.patient.last_name}`.trim();

                return (
                  <Link
                    key={appointment.uid}
                    href={`/organization/homeopathy/appointments/${appointment.uid}`}
                  >
                    <Card
                      glow
                      className='border-border/60 hover:border-primary/40 flex h-full flex-col gap-0 overflow-hidden p-0 shadow-sm transition-all hover:shadow-md'
                    >
                      <div className='flex items-start gap-3 p-4'>
                        {/* Avatar */}
                        <div className='bg-primary/5 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold'>
                          <User className='h-5 w-5' />
                        </div>

                        {/* Name */}
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm leading-tight font-semibold'>
                            {patientName}
                          </p>

                          <p className='text-muted-foreground mt-1 truncate text-xs'>
                            {appointment.patient.phone}
                          </p>
                        </div>

                        {/* Status */}
                        <Badge
                          variant='outline'
                          className={`shrink-0 text-[11px] font-medium ${statusClass}`}
                        >
                          {formatChoiceFieldValue(appointment.status)}
                        </Badge>
                      </div>

                      <div className='border-border/60 border-t' />

                      <div className='flex flex-col gap-3 p-4 text-xs'>
                        {/* Symptoms */}
                        <div className='flex items-start gap-2'>
                          <Stethoscope className='text-secondary mt-0.5 h-3.5 w-3.5 shrink-0' />

                          <div className='min-w-0'>
                            <p className='text-muted-foreground'>Symptoms</p>

                            <p className='line-clamp-2 font-medium'>
                              {appointment.symptoms || 'Not recorded'}
                            </p>
                          </div>
                        </div>

                        {/* Treatment effectiveness */}
                        <div className='flex items-start gap-2'>
                          <ClipboardList className='text-info mt-0.5 h-3.5 w-3.5 shrink-0' />

                          <div className='min-w-0'>
                            <p className='text-muted-foreground'>
                              Treatment Effectiveness
                            </p>

                            <p className='line-clamp-2 font-medium'>
                              {appointment.treatment_effectiveness ||
                                'Not recorded'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='border-border/60 bg-muted/30 mt-auto flex items-center justify-between border-t px-4 py-3'>
                        {/* Files */}
                        <div className='flex items-center gap-2 text-xs'>
                          <FileText className='text-warning h-3.5 w-3.5' />

                          <span className='font-medium'>
                            {appointment.files?.length ?? 0}{' '}
                            {appointment.files?.length === 1 ? 'File' : 'Files'}
                          </span>
                        </div>

                        {/* Created */}
                        <div className='flex items-center gap-1.5'>
                          <CalendarDays className='text-muted-foreground h-3.5 w-3.5' />

                          <span className='text-muted-foreground text-xs'>
                            {formatDateAndTime(appointment.created_at)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <div className='flex items-center justify-between'>
              {(appointments?.count ?? 0) > 0 && (
                <p className='text-muted-foreground text-sm whitespace-nowrap'>
                  Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                  {Math.min(page * PAGE_LIMIT, appointments?.count ?? 0)} of{' '}
                  {appointments?.count ?? 0} Appointments
                </p>
              )}

              {totalPages > 1 && (
                <Pagination className='justify-end'>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          page > 1 && setPage((currentPage) => currentPage - 1)
                        }
                        aria-disabled={page === 1}
                        className={
                          page === 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {getPageNumbers().map((pageNumber, index) =>
                      pageNumber === '...' ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            isActive={pageNumber === page}
                            onClick={() => setPage(pageNumber)}
                            className='cursor-pointer'
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          page < totalPages &&
                          setPage((currentPage) => currentPage + 1)
                        }
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
          </>
        )}
    </div>
  );
};

export default AppointmentList;
