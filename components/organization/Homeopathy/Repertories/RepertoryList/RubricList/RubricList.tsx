'use client';

import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useGetRepertoriesRubricsQuery } from '@/lib/services/endpoints/organization/Homeopathy/Repertories/RepertoriesApi';
import { RubricListProps } from '@/types/Organization/Homeopathy/Repertories/RepertoriesType';
import { PAGE_LIMIT } from '@/utils/constants';
import { FileText, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getEntryLabel, toCount, toEntries } from '../utils';

const RubricList: React.FC<RubricListProps> = ({
  repertoryUid,
  selectedRubrics,
  onToggleRubric,
}) => {
  const { dict } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const {
    data: rubrics,
    isLoading,
    isFetching,
    isError,
  } = useGetRepertoriesRubricsQuery({
    repertoryUid,
    page,
    page_size: PAGE_LIMIT,
    ...(search ? { search } : {}),
  });

  const entries = toEntries(rubrics);
  const total = toCount(rubrics);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));
  const selectedUids = new Set(selectedRubrics.map((rubric) => rubric.uid));

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

  return (
    <div className='flex flex-col gap-4'>
      {/* SEARCH */}

      <div className='relative'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />

        <Input
          type='text'
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={dict.repertories.list.searchRubrics}
          className='pr-9! pl-9!'
        />

        {searchInput && (
          <button
            type='button'
            onClick={() => setSearchInput('')}
            className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer'
            aria-label={dict.common.close}
          >
            <X className='h-4 w-4' />
          </button>
        )}
      </div>

      {isLoading && (
        <div className='flex flex-col gap-2'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='bg-background h-12 animate-pulse rounded-lg'
            />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className='border-danger/40 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <FileText className='text-danger/50 h-10 w-10' />

          <p className='mt-3 text-sm font-medium'>
            {dict.repertories.list.rubricsError}
          </p>
        </div>
      )}

      {!isLoading && !isError && !entries.length && (
        <div className='border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <FileText className='text-muted-foreground/40 h-10 w-10' />

          <p className='text-muted-foreground mt-3 text-sm'>
            {search
              ? dict.repertories.list.noMatchingRubrics
              : dict.repertories.list.noRubrics}
          </p>
        </div>
      )}

      {!isLoading && !isError && !!entries.length && (
        <>
          <Card
            className={`border-border/60 gap-0 divide-y p-0 shadow-sm ${
              isFetching ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {entries.map((entry, index) => {
              const label = getEntryLabel(entry) ?? '';
              const isSelected = !!entry.uid && selectedUids.has(entry.uid);

              return (
                <label
                  key={entry.uid ?? index}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isSelected ? 'bg-primary/5' : 'hover:bg-muted/40'
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={!entry.uid}
                    onCheckedChange={() =>
                      entry.uid && onToggleRubric({ uid: entry.uid, label })
                    }
                  />

                  <span className='min-w-0 flex-1 truncate'>{label}</span>
                </label>
              );
            })}
          </Card>

          <div className='flex items-center justify-between'>
            <p className='text-muted-foreground text-sm whitespace-nowrap'>
              {dict.repertories.list.showingResults
                .replace('{from}', String((page - 1) * PAGE_LIMIT + 1))
                .replace('{to}', String(Math.min(page * PAGE_LIMIT, total)))
                .replace('{total}', String(total))}
            </p>

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

export default RubricList;
