'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

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
import { HOMEOPATHIC_MEDICINE_STATUS_OPTIONS } from '@/data/common/ChoiceFields';
import { useGetMedicinesQuery } from '@/lib/services/endpoints/organization/Homeopathy/Medicines/MedicinesApi';
import {
  Medicine,
  MedicineStatus,
} from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { PAGE_LIMIT } from '@/utils/constants';
import { formatChoiceFieldValue, formatDateAndTime } from '@/utils/formatters';

import { MEDICINE_STATUS_STYLES } from '@/data/Organization/Medicines/MedicinesData';
import {
  Boxes,
  CalendarClock,
  FileText,
  Package,
  Pill,
  Plus,
  Search,
  SlidersHorizontal,
  Tag,
  X,
} from 'lucide-react';

const toApiDate = (date?: Date) =>
  date ? format(date, 'yyyy-MM-dd') : undefined;

const MedicineList: React.FC = () => {
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [status, setStatus] = useState<MedicineStatus | 'ALL'>('ALL');

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const expirationGte = toApiDate(dateRange?.from);
  const expirationLte = toApiDate(dateRange?.to);

  const {
    data: medicines,
    isLoading,
    isFetching,
    isError,
  } = useGetMedicinesQuery({
    page,
    page_size: PAGE_LIMIT,
    ...(search ? { search } : {}),
    ...(status !== 'ALL' ? { status } : {}),
    ...(expirationGte ? { expiration_date__gte: expirationGte } : {}),
    ...(expirationLte ? { expiration_date__lte: expirationLte } : {}),
  });

  const totalPages = Math.max(
    1,
    Math.ceil((medicines?.count ?? 0) / PAGE_LIMIT),
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
    search !== '' || status !== 'ALL' || !!dateRange?.from || !!dateRange?.to;

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setStatus('ALL');
    setDateRange(undefined);
    setPage(1);
  };

  const dateRangeLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
      : format(dateRange.from, 'MMM d, yyyy')
    : 'Expiration date';

  return (
    <div className='flex flex-col gap-4'>
      {/* HEADER */}

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-xl font-semibold tracking-tight'>Medicines</h1>

          <p className='text-muted-foreground mt-1 text-sm'>
            Manage and view all medicines in your inventory.
          </p>
        </div>

        <Button>
          <Plus className='h-4 w-4' />
          Add Medicine
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
            placeholder='Search by name, manufacturer, batch number...'
            className='pl-9!'
          />
        </div>

        {/* Status */}
        <Select
          items={HOMEOPATHIC_MEDICINE_STATUS_OPTIONS}
          value={status}
          onValueChange={(value) => {
            setStatus(value as MedicineStatus | 'ALL');
            setPage(1);
          }}
        >
          <SelectTrigger className='w-full sm:w-40'>
            <SelectValue placeholder='Status' />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value='ALL'>All Status</SelectItem>

            {HOMEOPATHIC_MEDICINE_STATUS_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Expiration date range */}
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

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            size='lg'
            variant='destructive'
            className='h-10!'
            onClick={clearFilters}
          >
            <X className='h-3.5 w-3.5' />
            Clear filters
          </Button>
        )}
      </Card>

      {isLoading && (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='bg-background h-56 animate-pulse rounded-xl'
            />
          ))}
        </div>
      )}

      {/* ERROR */}

      {!isLoading && isError && (
        <div className='border-danger/40 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <Pill className='text-danger/50 h-10 w-10' />

          <p className='mt-3 text-sm font-medium'>Failed to load medicines</p>

          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            Something went wrong while loading the medicine list.
          </p>
        </div>
      )}

      {/* EMPTY STATE */}

      {!isLoading && !isError && !medicines?.results?.length && (
        <div className='border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <Package className='text-muted-foreground/40 h-10 w-10' />

          <p className='mt-3 text-sm font-medium'>
            {hasActiveFilters ? 'No matching medicines' : 'No medicines yet'}
          </p>

          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            {hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'Medicines will appear here once they are added to the inventory.'}
          </p>
        </div>
      )}

      {/* MEDICINE LIST */}

      {!isLoading &&
        !isError &&
        medicines?.results &&
        medicines.results.length > 0 && (
          <>
            <div
              className={`grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 ${
                isFetching ? 'pointer-events-none opacity-60' : ''
              }`}
            >
              {medicines.results.map((medicine: Medicine) => {
                const statusClass =
                  MEDICINE_STATUS_STYLES[medicine.status] ??
                  MEDICINE_STATUS_STYLES.UNAVAILABLE;

                return (
                  <Link
                    key={medicine.uid}
                    href={`/organization/homeopathy/medicines/${medicine.uid}`}
                  >
                    <Card
                      glow
                      className='border-border/60 hover:border-primary/40 flex h-full flex-col gap-0 overflow-hidden p-0 shadow-sm transition-all hover:shadow-md'
                    >
                      <div className='flex items-start gap-3 p-4'>
                        <div className='bg-primary/5 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold'>
                          <Pill className='h-5 w-5' />
                        </div>

                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm leading-tight font-semibold'>
                            {medicine.name}
                          </p>

                          <div className='mt-1 flex items-center gap-2'>
                            <span className='text-muted-foreground text-xs'>
                              Power {medicine.power}
                            </span>

                            <span className='text-muted-foreground/50'>•</span>

                            <span className='text-muted-foreground text-xs'>
                              {medicine.manufacturer}
                            </span>
                          </div>
                        </div>

                        <Badge
                          variant='outline'
                          className={`shrink-0 text-[11px] font-medium ${statusClass}`}
                        >
                          {formatChoiceFieldValue(medicine.status)}
                        </Badge>
                      </div>

                      <div className='border-border/60 border-t' />

                      <div className='grid grid-cols-2 gap-3 p-4 text-xs'>
                        {/* Quantity */}
                        <div className='flex items-center gap-2'>
                          <Boxes className='text-primary h-3.5 w-3.5 shrink-0' />

                          <div className='min-w-0'>
                            <p className='text-muted-foreground'>Quantity</p>

                            <p className='truncate font-medium'>
                              {medicine.total_quantity} units
                            </p>
                          </div>
                        </div>

                        {/* Unit price */}
                        <div className='flex items-center gap-2'>
                          <Tag className='text-secondary h-3.5 w-3.5 shrink-0' />

                          <div className='min-w-0'>
                            <p className='text-muted-foreground'>Unit Price</p>

                            <p className='truncate font-medium'>
                              ${medicine.unit_price}
                            </p>
                          </div>
                        </div>

                        {/* Batch number */}
                        <div className='col-span-2 flex items-center gap-2'>
                          <FileText className='text-info h-3.5 w-3.5 shrink-0' />

                          <div className='min-w-0'>
                            <p className='text-muted-foreground'>
                              Batch Number
                            </p>

                            <p className='truncate font-medium'>
                              {medicine.batch_number}
                            </p>
                          </div>
                        </div>

                        {/* Expiration */}
                        <div className='col-span-2 flex items-center gap-2'>
                          <CalendarClock className='text-warning h-3.5 w-3.5 shrink-0' />

                          <div className='min-w-0'>
                            <p className='text-muted-foreground'>
                              Expiration Date
                            </p>

                            <p className='truncate font-medium'>
                              {medicine.expiration_date}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='border-border/60 bg-muted/30 mt-auto flex items-center justify-between border-t px-4 py-3'>
                        <div className='flex items-center gap-2 text-xs'>
                          <FileText className='text-warning h-3.5 w-3.5' />

                          <span className='font-medium'>
                            {medicine.files?.length ?? 0}{' '}
                            {medicine.files?.length === 1 ? 'File' : 'Files'}
                          </span>
                        </div>

                        <span className='text-muted-foreground text-xs'>
                          {formatDateAndTime(medicine.created_at)}
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <div className='flex items-center justify-between'>
              {(medicines?.count ?? 0) > 0 && (
                <p className='text-muted-foreground text-sm whitespace-nowrap'>
                  Showing {(page - 1) * PAGE_LIMIT + 1} to{' '}
                  {Math.min(page * PAGE_LIMIT, medicines?.count ?? 0)} of{' '}
                  {medicines?.count ?? 0} Medicines
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

export default MedicineList;
