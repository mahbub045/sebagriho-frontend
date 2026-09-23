'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useRepertoryAnalysisMutation } from '@/lib/services/endpoints/organization/Homeopathy/Repertories/RepertoriesApi';
import {
  AnalysisRemedy,
  RepertoryAnalysisProps,
  RepertoryAnalysisResponse,
} from '@/types/Organization/Homeopathy/Repertories/RepertoriesType';
import { FlaskConical, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

const RepertoryAnalysis: React.FC<RepertoryAnalysisProps> = ({
  repertoryUid,
  selectedRubrics,
  onRemoveRubric,
  onClearRubrics,
}) => {
  const { dict } = useTranslation();
  const [analyze, { data, isLoading, isError, reset }] =
    useRepertoryAnalysisMutation();

  // analyze/reset change identity after every mutation state update, so keep
  // them in refs — depending on them directly re-runs the effect in a loop
  const analyzeRef = useRef(analyze);
  const resetRef = useRef(reset);

  useEffect(() => {
    analyzeRef.current = analyze;
    resetRef.current = reset;
  });

  // Re-run the analysis whenever the selected rubric set changes
  const rubricKey = selectedRubrics.map((rubric) => rubric.uid).join(',');

  useEffect(() => {
    if (!rubricKey) {
      resetRef.current();
      return;
    }

    analyzeRef.current({
      repertoryUid,
      payload: { rubric_uids: rubricKey.split(',') },
    });
  }, [rubricKey, repertoryUid]);

  const analysis = data as RepertoryAnalysisResponse | undefined;
  const remedies: AnalysisRemedy[] = analysis?.remedies ?? [];

  return (
    <Card className='border-border/60 flex flex-col gap-4 p-4 shadow-sm xl:absolute xl:inset-0'>
      {/* HEADER */}

      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <FlaskConical className='text-primary h-4 w-4' />

          <h2 className='text-sm font-semibold'>
            {dict.repertories.analysis.title}
          </h2>

          {isLoading && (
            <Loading className='text-muted-foreground! h-3.5 w-3.5' />
          )}
        </div>

        {!!selectedRubrics.length && (
          <Button variant='destructive' size='sm' onClick={onClearRubrics}>
            <X className='h-3.5 w-3.5' />
            {dict.repertories.analysis.clearAll}
          </Button>
        )}
      </div>

      {/* SELECTED RUBRICS */}

      {!selectedRubrics.length ? (
        <p className='text-muted-foreground border-border rounded-lg border border-dashed py-10 text-center text-sm'>
          {dict.repertories.analysis.selectHint}
        </p>
      ) : (
        <div className='flex max-h-[30%] min-h-0 shrink-0 flex-col gap-2'>
          <p className='text-muted-foreground text-xs font-medium'>
            {dict.repertories.analysis.selectedRubrics.replace(
              '{count}',
              String(selectedRubrics.length),
            )}
          </p>

          <div className='flex max-h-[30vh] min-h-0 flex-wrap gap-1.5 overflow-y-auto pr-1 xl:max-h-none'>
            {selectedRubrics.map((rubric) => (
              <Badge
                key={rubric.uid}
                variant='outline'
                className='h-auto max-w-full gap-1 py-1 pr-1 pl-2.5 whitespace-normal'
              >
                <span className='text-left text-xs'>{rubric.label}</span>

                <button
                  type='button'
                  onClick={() => onRemoveRubric(rubric.uid)}
                  className='hover:bg-muted cursor-pointer rounded-full p-0.5'
                  aria-label={dict.repertories.analysis.remove}
                >
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* RESULT */}

      {!!selectedRubrics.length && isError && (
        <p className='border-danger/40 text-danger rounded-lg border border-dashed py-6 text-center text-sm'>
          {dict.repertories.analysis.error}
        </p>
      )}

      {!!selectedRubrics.length && !isError && analysis && (
        <div
          className={`flex min-h-0 flex-1 flex-col gap-2 ${
            isLoading ? 'pointer-events-none opacity-60' : ''
          }`}
        >
          <p className='text-muted-foreground text-xs font-medium'>
            {dict.repertories.analysis.remediesFound.replace(
              '{count}',
              String(remedies.length),
            )}
          </p>

          {!remedies.length && (
            <p className='text-muted-foreground py-6 text-center text-sm'>
              {dict.repertories.analysis.noRemedies}
            </p>
          )}

          <div className='flex max-h-[60vh] min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1 xl:max-h-none'>
            {remedies.map((remedy, index) => (
              <div
                key={remedy.uid}
                className='border-border/60 flex flex-col gap-2 rounded-lg border p-3'
              >
                <div className='flex items-start gap-3'>
                  <span className='bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold'>
                    {index + 1}
                  </span>

                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold'>
                      {remedy.name}{' '}
                      <span className='text-muted-foreground font-normal'>
                        ({remedy.abbreviation})
                      </span>
                    </p>

                    {remedy.alternative_name && (
                      <p className='text-muted-foreground truncate text-xs'>
                        {remedy.alternative_name}
                      </p>
                    )}
                  </div>

                  <div className='shrink-0 text-right text-xs'>
                    <p className='font-semibold'>{remedy.match_percentage}%</p>

                    <p className='text-muted-foreground'>
                      {dict.repertories.analysis.grade} {remedy.total_grade}
                    </p>
                  </div>
                </div>

                {/* Match bar */}
                <div className='flex items-center gap-2'>
                  <div className='bg-muted h-1.5 flex-1 overflow-hidden rounded-full'>
                    <div
                      className='bg-primary h-full rounded-full'
                      style={{ width: `${remedy.match_percentage}%` }}
                    />
                  </div>

                  <span className='text-muted-foreground text-xs whitespace-nowrap'>
                    {remedy.matched_count}/{remedy.total_selected}
                  </span>
                </div>

                {/* Matched rubrics */}
                <ul className='flex flex-col gap-1'>
                  {remedy.matched_rubrics.map((rubric) => (
                    <li
                      key={rubric.rubric_uid}
                      className='text-muted-foreground flex items-start justify-between gap-2 text-xs'
                    >
                      <span className='min-w-0 flex-1'>
                        {rubric.translated_full_path ?? rubric.full_path}
                      </span>

                      <Badge variant='outline' className='shrink-0'>
                        {rubric.grade}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default RepertoryAnalysis;
