'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  HOMEOPATHIC_PATIENT_STATUS_OPTIONS,
  MIASM_TYPE_OPTIONS,
} from '@/data/common/ChoiceFields';
import {
  MIASM_STYLES,
  STATUS_STYLES,
} from '@/data/Organization/Homeopathy/PatientsData';
import { useGetPatientsQuery } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';
import {
  MiasmType,
  Patient,
  PatientStatus,
} from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { PAGE_LIMIT } from '@/utils/constants';
import { formatDateAndTime, getInitials } from '@/utils/formatters';
import {
  CalendarDays,
  FileText,
  MapPin,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Stethoscope,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const capitalize = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

const PatientList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PatientStatus | 'ALL'>('ALL');
  const [miasmType, setMiasmType] = useState<MiasmType | 'ALL'>('ALL');

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const {
    data: patients,
    isLoading,
    isFetching,
    isError,
  } = useGetPatientsQuery({
    page,
    page_size: PAGE_LIMIT,
    ...(search ? { search } : {}),
    ...(status !== 'ALL' ? { status } : {}),
    ...(miasmType !== 'ALL' ? { miasm_type: miasmType } : {}),
  });

  const totalPages = Math.max(
    1,
    Math.ceil((patients?.count ?? 0) / PAGE_LIMIT),
  );

  const hasActiveFilters =
    search !== '' || status !== 'ALL' || miasmType !== 'ALL';

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatus('ALL');
    setMiasmType('ALL');
    setPage(1);
  };

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

  const Header = (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <h1 className='text-xl font-semibold tracking-tight'>Patients</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Manage and view all patient records in your organization.
        </p>
      </div>
      <Button asChild className='w-full gap-1.5 sm:w-auto'>
        <Link href='/organization/homeopathy/patients/create'>
          <Plus className='h-4 w-4' />
          Add Patient
        </Link>
      </Button>
    </div>
  );

  const FilterBar = (
    <Card className='border-border/60 flex flex-col gap-3 p-4 shadow-sm sm:flex-row sm:items-center'>
      <div className='text-muted-foreground hidden items-center gap-1.5 text-xs font-medium sm:flex'>
        <SlidersHorizontal className='h-3.5 w-3.5' />
      </div>
      <div className='relative flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          type='text'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder='Search by name, serial number, phone...'
          className='pl-9!'
        />
      </div>
      <Select
        items={HOMEOPATHIC_PATIENT_STATUS_OPTIONS}
        value={status}
        onValueChange={(value) => {
          setStatus(value as PatientStatus | 'ALL');
          setPage(1);
        }}
      >
        <SelectTrigger className='w-full sm:w-40'>
          <SelectValue placeholder='Status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='ALL'>All Status</SelectItem>
          {HOMEOPATHIC_PATIENT_STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        items={MIASM_TYPE_OPTIONS}
        value={miasmType}
        onValueChange={(value) => {
          setMiasmType(value as MiasmType | 'ALL');
          setPage(1);
        }}
      >
        <SelectTrigger className='w-full sm:w-40'>
          <SelectValue placeholder='Miasm Type' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='ALL'>All Miasm</SelectItem>
          {MIASM_TYPE_OPTIONS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasActiveFilters && (
        <Button variant='destructive' size='lg' onClick={clearFilters}>
          <X className='h-3.5 w-3.5' />
          Clear filters
        </Button>
      )}
    </Card>
  );

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        {Header}
        {FilterBar}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='bg-background h-60 animate-pulse rounded-xl'
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex flex-col gap-4'>
        {Header}
        {FilterBar}
        <div className='border-danger/40 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <Stethoscope className='text-danger/50 h-10 w-10' />
          <p className='mt-3 text-sm font-medium'>Failed to load patients</p>
          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            Something went wrong while loading the patient list.
          </p>
        </div>
      </div>
    );
  }

  if (!patients?.results?.length) {
    return (
      <div className='flex flex-col gap-4'>
        {Header}
        {FilterBar}
        <div className='border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <User className='text-muted-foreground/40 h-10 w-10' />
          <p className='mt-3 text-sm font-medium'>
            {hasActiveFilters ? 'No matching patients' : 'No patients yet'}
          </p>
          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            {hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'Patients will appear here once they are added to the system.'}
          </p>
          {!hasActiveFilters && (
            <Button asChild className='mt-4 gap-1.5'>
              <Link href='/organization/homeopathy/patients/create'>
                <Plus className='h-4 w-4' />
                Add Patient
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {Header}
      {FilterBar}
      <div
        className={`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 ${isFetching ? 'pointer-events-none opacity-60' : ''}`}
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
                className='border-border/60 hover:border-primary/40 flex h-full flex-col gap-0 overflow-hidden p-0 shadow-sm transition-all hover:shadow-md'
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
                    {capitalize(patient.status)}
                  </Badge>
                </div>
                <div className='border-border/60 border-t' />
                {/* Patient meta */}
                <div className='grid grid-cols-2 gap-3 p-4 text-xs'>
                  <div className='flex items-center gap-2'>
                    <User className='text-primary h-3.5 w-3.5 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-muted-foreground'>Age / Gender</p>
                      <p className='truncate font-medium'>
                        {patient.age ?? 'N/A'} years •{' '}
                        {patient.user.gender
                          ? capitalize(patient.user.gender)
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Stethoscope className='text-secondary h-3.5 w-3.5 shrink-0' />
                    <div className='min-w-0'>
                      <p className='text-muted-foreground'>Miasm</p>
                      <Badge
                        variant='outline'
                        className={`mt-0.5 text-[10px] font-medium ${miasmClass}`}
                      >
                        {patient.miasm_type
                          ? capitalize(patient.miasm_type)
                          : 'Not specified'}
                      </Badge>
                    </div>
                  </div>
                  <div className='col-span-2 flex items-center gap-2'>
                    <Phone className='text-info h-3.5 w-3.5 shrink-0' />
                    {patient.user.phone || patient.relative_phone ? (
                      <div className='min-w-0'>
                        <p className='text-muted-foreground'>Contact</p>
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
            Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
            {Math.min(page * PAGE_LIMIT, patients?.count ?? 0)} of{' '}
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
