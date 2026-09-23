'use client';

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
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useGetRepertoriesChaptersQuery } from '@/lib/services/endpoints/organization/Homeopathy/Repertories/RepertoriesApi';
import { ChapterListProps } from '@/types/Organization/Homeopathy/Repertories/RepertoriesType';
import { PAGE_LIMIT } from '@/utils/constants';
import { ChevronRight, ListTree } from 'lucide-react';
import { useState } from 'react';
import { getEntryLabel, toCount, toEntries } from '../utils';
import ChapterRubrics from './ChapterRubrics/ChapterRubrics';

const ChapterList: React.FC<ChapterListProps> = ({ repertoryUid }) => {
  const { dict } = useTranslation();
  const [page, setPage] = useState(1);
  const [expandedUid, setExpandedUid] = useState<string | null>(null);

  const {
    data: chapters,
    isLoading,
    isFetching,
    isError,
  } = useGetRepertoriesChaptersQuery({
    repertoryUid,
    page,
    page_size: PAGE_LIMIT,
  });

  const entries = toEntries(chapters);
  const total = toCount(chapters);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

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
      <div className='flex flex-col gap-2'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='bg-background h-12 animate-pulse rounded-lg'
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='border-danger/40 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
        <ListTree className='text-danger/50 h-10 w-10' />

        <p className='mt-3 text-sm font-medium'>
          {dict.repertories.list.chaptersError}
        </p>
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className='border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
        <ListTree className='text-muted-foreground/40 h-10 w-10' />

        <p className='text-muted-foreground mt-3 text-sm'>
          {dict.repertories.list.noChapters}
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <Card
        className={`border-border/60 gap-0 divide-y p-0 shadow-sm ${
          isFetching ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        {entries.map((entry, index) => {
          const isExpanded = !!entry.uid && expandedUid === entry.uid;

          return (
            <div key={entry.uid ?? index}>
              <button
                type='button'
                disabled={!entry.uid}
                onClick={() =>
                  setExpandedUid(isExpanded ? null : (entry.uid ?? null))
                }
                className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm transition-colors ${
                  isExpanded ? 'bg-muted/40 font-medium' : 'hover:bg-muted/40'
                }`}
              >
                <ChevronRight
                  className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />

                <ListTree className='text-secondary h-4 w-4 shrink-0' />

                <span className='min-w-0 flex-1 truncate'>
                  {getEntryLabel(entry)}
                </span>
              </button>

              {isExpanded && entry.uid && (
                <ChapterRubrics
                  repertoryUid={repertoryUid}
                  chapterUid={entry.uid}
                  chapterLabel={getEntryLabel(entry) ?? ''}
                />
              )}
            </div>
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
    </div>
  );
};

export default ChapterList;
