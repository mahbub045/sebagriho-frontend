'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  localizeOptions,
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

import {
  formatChoiceFieldValue,
  formatDateAndTime,
  getInitials,
} from '@/utils/formatters';

import {
  CalendarDays,
  FileText,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Stethoscope,
  User,
  X,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTranslation } from '@/lib/i18n/useTranslation';
import AddPatientDialog from './Dialogs/AddPatientDialog';

const PatientList: React.FC = () => {
  const { dict, locale } = useTranslation();
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [status, setStatus] = useState<PatientStatus | 'ALL'>('ALL');

  const [miasmType, setMiasmType] = useState<MiasmType | 'ALL'>('ALL');

  const [isPatientAdded, setIsPatientAdded] = useState(false);

  const homeopathicPatientStatusOptions = localizeOptions(
    HOMEOPATHIC_PATIENT_STATUS_OPTIONS,
    locale,
  );
  const miasmTypeOptions = localizeOptions(MIASM_TYPE_OPTIONS, locale);

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
          <h1 className='text-xl font-semibold tracking-tight'>
            {dict.patients.list.title}
          </h1>

          <p className='text-muted-foreground mt-1 text-sm'>
            {dict.patients.list.subtitle}
          </p>
        </div>

        {/* ONLY ADD PATIENT BUTTON */}
        <Button onClick={() => setIsPatientAdded(true)}>
          <Plus className='h-4 w-4' />
          {dict.patients.list.addPatient}
        </Button>
      </div>

      {/* FILTER BAR */}

      <Card className='border-border/60 flex flex-col gap-3 p-4 shadow-sm sm:flex-row sm:items-center'>
        {/* Filter icon */}
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
            placeholder={dict.patients.list.searchPlaceholder}
            className='pl-9!'
          />
        </div>

        {/* Status */}
        <Select
          items={[
            { value: 'ALL', label: dict.patients.list.allStatus },
            ...homeopathicPatientStatusOptions,
          ]}
          value={status}
          onValueChange={(value) => {
            setStatus(value as PatientStatus | 'ALL');
            setPage(1);
          }}
        >
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder={dict.patients.list.statusPlaceholder} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='ALL'>{dict.patients.list.allStatus}</SelectItem>

            {homeopathicPatientStatusOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Miasm */}
        <Select
          items={[
            { value: 'ALL', label: dict.patients.list.allMiasm },
            ...miasmTypeOptions,
          ]}
          value={miasmType}
          onValueChange={(value) => {
            setMiasmType(value as MiasmType | 'ALL');
            setPage(1);
          }}
        >
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder={dict.patients.list.miasmPlaceholder} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='ALL'>{dict.patients.list.allMiasm}</SelectItem>

            {miasmTypeOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button variant='destructive' size='lg' onClick={clearFilters}>
            <X className='h-3.5 w-3.5' />
            {dict.patients.list.clearFilters}
          </Button>
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
            {dict.patients.list.failedToLoad}
          </p>

          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            {dict.patients.list.failedToLoadDescription}
          </p>
        </div>
      )}

      {/* EMPTY STATE */}

      {!isLoading && !isError && !patients?.results?.length && (
        <div className='border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <User className='text-muted-foreground/40 h-10 w-10' />

          <p className='mt-3 text-sm font-medium'>
            {hasActiveFilters
              ? dict.patients.list.noMatchingPatients
              : dict.patients.list.noPatientsYet}
          </p>

          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            {hasActiveFilters
              ? dict.patients.list.adjustFilters
              : dict.patients.list.emptyDescription}
          </p>
        </div>
      )}

      {/* PATIENT LIST */}

      {!isLoading &&
        !isError &&
        patients?.results &&
        patients.results.length > 0 && (
          <>
            <div
              className={`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 ${
                isFetching ? 'pointer-events-none opacity-60' : ''
              }`}
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
                      <div className='flex items-start gap-3 p-4'>
                        {/* Avatar */}
                        <Avatar className='border-border/60 h-10 w-10 border'>
                          <AvatarImage
                            src={patient.user.avatar ?? undefined}
                            alt={dict.patients.list.avatarAlt.replace(
                              '{name}',
                              patient.user.name,
                            )}
                          />

                          <AvatarFallback className='bg-primary/5 text-primary text-sm font-semibold'>
                            {getInitials(
                              patient.user.first_name,
                              patient.user.last_name,
                            )}
                          </AvatarFallback>
                        </Avatar>

                        {/* Name */}
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm leading-tight font-semibold'>
                            {patient.user.name}
                          </p>

                          <div className='mt-1 flex items-center gap-2'>
                            <span className='text-muted-foreground text-xs'>
                              #{patient.serial_number}
                            </span>

                            {patient.old_serial_number && (
                              <>
                                <span className='text-muted-foreground/50'>
                                  •
                                </span>

                                <span className='text-muted-foreground text-xs'>
                                  {dict.patients.list.oldSerialNumberShort.replace(
                                    '{number}',
                                    String(patient.old_serial_number),
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* blood_group */}
                        <Badge
                          variant='default'
                          className={`shrink-0 text-[11px] font-medium`}
                        >
                          {dict.patients.list.bloodGroupLabel.replace(
                            '{value}',
                            patient.user.blood_group
                              ? formatChoiceFieldValue(
                                  patient.user.blood_group,
                                  locale,
                                )
                              : dict.patients.list.notAvailable,
                          )}
                        </Badge>
                      </div>

                      <div className='border-border/60 border-t' />

                      <div className='grid grid-cols-2 gap-3 p-4 text-xs'>
                        {/* Age / Gender */}
                        <div className='flex items-center gap-2'>
                          <User className='text-primary h-3.5 w-3.5 shrink-0' />

                          <div className='min-w-0'>
                            <p className='text-muted-foreground'>
                              {dict.patients.list.ageGenderLabel}
                            </p>

                            <p className='truncate font-medium'>
                              {dict.patients.list.ageGenderValue
                                .replace(
                                  '{age}',
                                  String(
                                    patient.age ??
                                      dict.patients.list.notAvailable,
                                  ),
                                )
                                .replace(
                                  '{gender}',
                                  patient.user.gender
                                    ? formatChoiceFieldValue(
                                        patient.user.gender,
                                        locale,
                                      )
                                    : dict.patients.list.notAvailable,
                                )}
                            </p>
                          </div>
                        </div>

                        {/* Miasm */}
                        <div className='flex items-center gap-2'>
                          <Stethoscope className='text-secondary h-3.5 w-3.5 shrink-0' />

                          <div className='min-w-0'>
                            <p className='text-muted-foreground'>
                              {dict.patients.list.miasmLabel}
                            </p>

                            <Badge
                              variant='outline'
                              className={`mt-0.5 text-[10px] font-medium ${miasmClass}`}
                            >
                              {patient.miasm_type
                                ? formatChoiceFieldValue(
                                    patient.miasm_type,
                                    locale,
                                  )
                                : dict.patients.list.notSpecified}
                            </Badge>
                          </div>
                        </div>

                        {/* Address */}
                        <div className='col-span-2 flex items-center gap-2'>
                          <MapPin className='text-success h-3.5 w-3.5 shrink-0' />

                          {patient.address ? (
                            <span className='text-muted-foreground truncate'>
                              {patient.address}
                            </span>
                          ) : (
                            <span className='text-muted-foreground italic'>
                              {dict.patients.list.addressNotProvided}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className='border-border/60 bg-muted/30 mt-auto flex items-center justify-between border-t px-4 py-3'>
                        {/* Files */}
                        <div className='flex items-center gap-2 text-xs'>
                          <FileText className='text-warning h-3.5 w-3.5' />

                          <span className='font-medium'>
                            {(patient.files?.length === 1
                              ? dict.patients.list.fileCountSingular
                              : dict.patients.list.fileCountPlural
                            ).replace(
                              '{count}',
                              String(patient.files?.length ?? 0),
                            )}
                          </span>
                        </div>

                        {/* Created */}
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

            <div className='flex items-center justify-between'>
              {(patients?.count ?? 0) > 0 && (
                <p className='text-muted-foreground text-sm whitespace-nowrap'>
                  {dict.patients.list.showingRange
                    .replace('{from}', String((page - 1) * PAGE_LIMIT + 1))
                    .replace(
                      '{to}',
                      String(
                        Math.min(page * PAGE_LIMIT, patients?.count ?? 0),
                      ),
                    )
                    .replace('{total}', String(patients?.count ?? 0))}
                </p>
              )}

              {totalPages > 1 && (
                <Pagination className='justify-end'>
                  <PaginationContent>
                    {/* Previous */}
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

                    {/* Pages */}
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

                    {/* Next */}
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

      {/* ==================================================
          ADD PATIENT DIALOG
          Rendered exactly once
      ================================================== */}

      <AddPatientDialog
        isOpen={isPatientAdded}
        onClose={() => setIsPatientAdded(false)}
      />
    </div>
  );
};

export default PatientList;
