'use client';

import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useGetHomeopathyRepertoriesQuery } from '@/lib/services/endpoints/organization/Homeopathy/Repertories/RepertoriesApi';
import {
  Repertory,
  RepertoryTab,
  SelectedRubric,
} from '@/types/Organization/Homeopathy/Repertories/RepertoriesType';
import { BookOpen, FileText, ListTree } from 'lucide-react';
import { useState } from 'react';
import ChapterList from './ChapterList/ChapterList';
import RepertoryAnalysis from './RepertoryAnalysis/RepertoryAnalysis';
import RubricList from './RubricList/RubricList';

const RepertoryList: React.FC = () => {
  const { dict } = useTranslation();
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<RepertoryTab>('rubrics');
  const [selectedRubrics, setSelectedRubrics] = useState<SelectedRubric[]>(
    [],
  );

  const toggleRubric = (rubric: SelectedRubric) => {
    setSelectedRubrics((current) =>
      current.some((item) => item.uid === rubric.uid)
        ? current.filter((item) => item.uid !== rubric.uid)
        : [...current, rubric],
    );
  };

  const removeRubric = (uid: string) => {
    setSelectedRubrics((current) => current.filter((item) => item.uid !== uid));
  };

  const {
    data: repertories,
    isLoading,
    isError,
  } = useGetHomeopathyRepertoriesQuery(undefined);

  const books: Repertory[] = repertories?.results ?? [];
  const repertoryUid = selectedUid ?? books[0]?.uid;

  return (
    <div className='flex flex-col gap-4'>
      {/* HEADER */}

      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-xl font-semibold tracking-tight'>
            {dict.repertories.list.title}
          </h1>

          <p className='text-muted-foreground mt-1 text-sm'>
            {dict.repertories.list.subtitle}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className='bg-background h-24 animate-pulse rounded-xl' />
      )}

      {/* ERROR */}

      {!isLoading && isError && (
        <div className='border-danger/40 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <BookOpen className='text-danger/50 h-10 w-10' />

          <p className='mt-3 text-sm font-medium'>
            {dict.repertories.list.errorTitle}
          </p>

          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            {dict.repertories.list.errorDescription}
          </p>
        </div>
      )}

      {/* EMPTY STATE */}

      {!isLoading && !isError && !books.length && (
        <div className='border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
          <BookOpen className='text-muted-foreground/40 h-10 w-10' />

          <p className='mt-3 text-sm font-medium'>
            {dict.repertories.list.emptyTitle}
          </p>

          <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
            {dict.repertories.list.emptyDescription}
          </p>
        </div>
      )}

      {!isLoading && !isError && !!repertoryUid && (
        <>
          {/* BOOK SELECT + TABS */}

          <Card className='border-border/60 flex flex-col gap-3 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
            <Select
              items={books.map((book) => ({
                value: book.uid,
                label: book.name,
              }))}
              value={repertoryUid}
              onValueChange={(value) => {
                // Rubrics belong to a single book, so a new book starts a fresh selection
                setSelectedUid(value as string);
                setSelectedRubrics([]);
              }}
            >
              <SelectTrigger className='w-full cursor-pointer sm:w-72'>
                <BookOpen className='text-primary h-4 w-4' />
                <SelectValue placeholder={dict.repertories.list.selectBook} />
              </SelectTrigger>

              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.uid} value={book.uid}>
                    {book.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as RepertoryTab)}
            >
              <TabsList className='border-border/60 bg-muted/40 h-auto w-fit gap-1 rounded-lg border p-0'>
                <TabsTrigger
                  value='rubrics'
                  className='text-foreground/70 data-active:text-foreground h-8 cursor-pointer gap-1.5 rounded-md px-3 data-active:font-semibold'
                >
                  <FileText className='h-3.5 w-3.5' />
                  {dict.repertories.list.rubrics}
                </TabsTrigger>

                <TabsTrigger
                  value='chapters'
                  className='text-foreground/70 data-active:text-foreground h-8 cursor-pointer gap-1.5 rounded-md px-3 data-active:font-semibold'
                >
                  <ListTree className='h-3.5 w-3.5' />
                  {dict.repertories.list.chapters}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </Card>

          {/* TAB CONTENT — keyed by book so pagination resets on book change */}

          {activeTab === 'rubrics' ? (
            <div className='grid grid-cols-1 gap-4 xl:grid-cols-5'>
              <div className='xl:col-span-3'>
                <RubricList
                  key={repertoryUid}
                  repertoryUid={repertoryUid}
                  selectedRubrics={selectedRubrics}
                  onToggleRubric={toggleRubric}
                />
              </div>

              {/* Absolutely filled on xl so the rubric list alone sets the row height */}
              <div className='relative xl:col-span-2'>
                <RepertoryAnalysis
                  repertoryUid={repertoryUid}
                  selectedRubrics={selectedRubrics}
                  onRemoveRubric={removeRubric}
                  onClearRubrics={() => setSelectedRubrics([])}
                />
              </div>
            </div>
          ) : (
            <ChapterList key={repertoryUid} repertoryUid={repertoryUid} />
          )}
        </>
      )}
    </div>
  );
};

export default RepertoryList;
