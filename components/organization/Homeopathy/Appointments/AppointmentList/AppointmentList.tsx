'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  HOMEOPATHIC_APPOINTMENT_STATUS_OPTIONS,
  MIASM_TYPE_OPTIONS,
} from '@/data/common/ChoiceFields';
import { STATUS_DOT_COLOR } from '@/data/Organization/Homeopathy/Appointments/AppointmentsData';
import { setAppointmentStatusFilter } from '@/lib/features/appointments/appointmentsSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useGetAppointmentsQuery } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import {
  Appointment,
  AppointmentStatus,
} from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { MiasmType } from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { PAGE_LIMIT } from '@/utils/constants';
import { formatDateAndTime, getInitials } from '@/utils/formatters';
import { format } from 'date-fns';
import {
  CalendarClock,
  CalendarDays,
  ClipboardList,
  FileText,
  Plus,
  Search,
  SlidersHorizontal,
  Stethoscope,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import CreateAppointmentDialog from './Dialog/CreateAppointmentDialog';

const toApiDate = (date?: Date) =>
  date ? format(date, 'yyyy-MM-dd') : undefined;

const AppointmentList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [miasmType, setMiasmType] = useState<MiasmType | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState(false);

  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.appointments.statusFilter);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const appointmentDateGte = toApiDate(dateRange?.from);
  const appointmentDateLte = toApiDate(dateRange?.to);

  const {
    data: appointments,
    isLoading,
    isFetching,
    isError,
  } = useGetAppointmentsQuery({
    page,
    page_size: PAGE_LIMIT,
    status,
    ...(search ? { search } : {}),
    ...(miasmType !== 'ALL'
      ? { homeopathic_patient__miasm_type: miasmType }
      : {}),
    ...(appointmentDateGte
      ? { appointment_date__gte: appointmentDateGte }
      : {}),
    ...(appointmentDateLte
      ? { appointment_date__lte: appointmentDateLte }
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
    search !== '' ||
    miasmType !== 'ALL' ||
    !!dateRange?.from ||
    !!dateRange?.to;

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');

    setMiasmType('ALL');
    setDateRange(undefined);
    setPage(1);
  };

  const dateRangeLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
      : format(dateRange.from, 'MMM d, yyyy')
    : 'Appointment date';

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
        <Button variant='default' onClick={() => setIsOpenCreateDialog(true)}>
          <Plus />
          Create Appointment
        </Button>
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

        {/* Appointment date range */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant='outline'
                className='h-10! w-full justify-start text-left font-normal sm:w-56'
              >
                <CalendarClock className='h-4 w-4' />
                <span className='truncate'>{dateRangeLabel}</span>
              </Button>
            }
          />

          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              mode='range'
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                setPage(1);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

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

      {/* STATUS TABS */}

      <Tabs
        value={status}
        onValueChange={(value) => {
          dispatch(setAppointmentStatusFilter(value as AppointmentStatus));
          setPage(1);
        }}
        className='items-center'
      >
        <TabsList className='border-border/60 bg-muted/40 h-auto w-fit gap-1 rounded-lg border p-0'>
          {HOMEOPATHIC_APPOINTMENT_STATUS_OPTIONS.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className='text-foreground/70 data-active:text-foreground h-8 cursor-pointer gap-1.5 rounded-md px-3 data-active:font-semibold'
            >
              <span
                className={`size-2 shrink-0 rounded-full ${
                  STATUS_DOT_COLOR[option.value as AppointmentStatus]
                }`}
              />
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
                const patientName =
                  `${appointment?.patient?.user?.first_name} ${appointment?.patient?.user?.last_name}`.trim();

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
                        <Avatar className='border-border/60 h-10 w-10 border'>
                          <AvatarImage
                            src={
                              appointment?.patient?.user?.avatar ?? undefined
                            }
                            alt={patientName}
                          />

                          <AvatarFallback className='bg-primary/5 text-primary text-sm font-semibold'>
                            {getInitials(
                              appointment?.patient?.user?.first_name,
                              appointment?.patient?.user?.last_name,
                            )}
                          </AvatarFallback>
                        </Avatar>

                        {/* Name */}
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm leading-tight font-semibold'>
                            {patientName}
                          </p>

                          <p className='text-muted-foreground mt-1 truncate text-xs'>
                            {appointment?.patient?.user?.phone ? (
                              appointment?.patient?.user?.phone
                            ) : (
                              <small className='text-muted-foreground italic'>
                                No phone number available
                              </small>
                            )}
                          </p>
                        </div>

                        {/* Status */}
                        <Badge
                          variant='success'
                          className={`shrink-0 text-[11px] font-medium`}
                        >
                          Patient SL -{' '}
                          {appointment?.patient?.serial_number ? (
                            appointment?.patient?.serial_number
                          ) : (
                            <small className='text-muted-foreground italic'>
                              No serial number available
                            </small>
                          )}
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
      {/* dialog  */}
      <CreateAppointmentDialog
        isOpen={isOpenCreateDialog}
        onClose={() => setIsOpenCreateDialog(false)}
      />
    </div>
  );
};

export default AppointmentList;
