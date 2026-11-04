'use client';

import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useGetRepertoriesRubricsQuery } from '@/lib/services/endpoints/organization/Homeopathy/Repertories/RepertoriesApi';
import {
  ChapterRubricsProps,
  SelectedRubric,
} from '@/types/Organization/Homeopathy/Repertories/RepertoriesType';
import { PAGE_LIMIT } from '@/utils/constants';
import { ChevronRight, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getEntryLabel, toCount, toEntries } from '../../utils';

const ChapterRubrics: React.FC<ChapterRubricsProps> = ({
  repertoryUid,
  chapterUid,
  chapterLabel,
}) => {
  const { dict } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  // Rubrics opened so far — the last one is the parent whose children are listed
  const [path, setPath] = useState<SelectedRubric[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const parent = path[path.length - 1];

  const {
    data: rubrics,
    isLoading,
    isFetching,
    isError,
  } = useGetRepertoriesRubricsQuery({
    repertoryUid,
    ...(parent ? { parent_uid: parent.uid } : { chapter_uid: chapterUid }),
    page,
    page_size: PAGE_LIMIT,
    ...(search ? { search } : {}),
  });

  const entries = toEntries(rubrics);
  const total = toCount(rubrics);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  // Moving to another level starts that level fresh
  const goTo = (nextPath: SelectedRubric[]) => {
    setPath(nextPath);
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  return (
    <div className='bg-muted/20 flex flex-col gap-3 py-3 pr-4 pl-11'>
      {/* BREADCRUMB */}

      <div className='flex flex-wrap items-center gap-1 text-xs'>
        <button
          type='button'
          onClick={() => goTo([])}
          className={`cursor-pointer hover:underline ${
            path.length ? 'text-primary' : 'text-foreground font-medium'
          }`}
        >
          {chapterLabel}
        </button>

        {path.map((rubric, index) => {
          const isLast = index === path.length - 1;

          return (
            <span key={rubric.uid} className='flex items-center gap-1'>
              <ChevronRight className='text-muted-foreground h-3 w-3' />

              <button
                type='button'
                onClick={() => goTo(path.slice(0, index + 1))}
                className={`cursor-pointer hover:underline ${
                  isLast ? 'text-foreground font-medium' : 'text-primary'
                }`}
              >
                {rubric.label}
              </button>
            </span>
          );
        })}
      </div>

      {/* SEARCH */}

      <div className='relative'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />

        <Input
          type='text'
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder={dict.repertories.list.searchRubrics}
          className='bg-background pr-9! pl-9!'
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
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className='bg-background h-8 animate-pulse rounded-md'
            />
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <p className='text-danger text-sm'>
          {dict.repertories.list.rubricsError}
        </p>
      )}

      {!isLoading && !isError && !entries.length && (
        <p className='text-muted-foreground text-sm'>
          {search
            ? dict.repertories.list.noMatchingRubrics
            : dict.repertories.list.noRubrics}
        </p>
      )}

      {!isLoading && !isError && !!entries.length && (
        <>
          <div
            className={`border-border/60 bg-background divide-border/60 divide-y rounded-lg border ${
              isFetching ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            {entries.map((entry, index) => {
              const label = getEntryLabel(entry) ?? '';

              return (
                // Clicking a rubric opens its children (parent_uid)
                <button
                  key={entry.uid ?? index}
                  type='button'
                  disabled={!entry.uid}
                  onClick={() =>
                    entry.uid && goTo([...path, { uid: entry.uid, label }])
                  }
                  className='hover:bg-muted/40 flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors'
                >
                  <span className='min-w-0 flex-1 truncate'>{label}</span>

                  <ChevronRight className='text-muted-foreground h-4 w-4 shrink-0' />
                </button>
              );
            })}
          </div>

          <div className='flex items-center justify-between'>
            <p className='text-muted-foreground text-xs whitespace-nowrap'>
              {dict.repertories.list.showingResults
                .replace('{from}', String((page - 1) * PAGE_LIMIT + 1))
                .replace('{to}', String(Math.min(page * PAGE_LIMIT, total)))
                .replace('{total}', String(total))}
            </p>

            {totalPages > 1 && (
              <Pagination className='mx-0 w-auto justify-end'>
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

                  <PaginationItem>
                    <span className='text-muted-foreground px-2 text-xs'>
                      {page} / {totalPages}
                    </span>
                  </PaginationItem>

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

export default ChapterRubrics;
