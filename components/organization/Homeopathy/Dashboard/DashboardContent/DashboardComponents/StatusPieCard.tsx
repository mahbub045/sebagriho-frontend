import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { formatChoiceFieldValue } from '@/utils/formatters';
import { PieChart as PieChartIcon } from 'lucide-react';
import { Cell, Pie, PieChart } from 'recharts';
import EmptyChartState from './EmptyChartState';

interface StatusPieCardProps {
  title: string;
  description: string;
  data: { status: string; count: number }[];
  config: ChartConfig;
}

const StatusPieCard: React.FC<StatusPieCardProps> = ({
  title,
  description,
  data,
  config,
}) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className='border-border/60 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <PieChartIcon className='text-info h-4 w-4' />
          {title}
        </CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length > 0 && total > 0 ? (
          <div className='flex flex-col items-center gap-4 sm:flex-row sm:justify-between'>
            <ChartContainer
              config={config}
              className='aspect-square h-56 w-full max-w-56 shrink-0'
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                <Pie
                  data={data}
                  dataKey='count'
                  nameKey='status'
                  innerRadius={55}
                  outerRadius={85}
                  strokeWidth={4}
                >
                  {data.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={`var(--color-${entry.status})`}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className='flex w-full flex-col gap-2.5 sm:w-auto'>
              {data.map((entry) => {
                const percentage = Math.round((entry.count / total) * 100);

                return (
                  <div
                    key={entry.status}
                    className='flex items-center justify-between gap-6 text-sm'
                  >
                    <div className='flex items-center gap-2'>
                      <span
                        className='h-2.5 w-2.5 shrink-0 rounded-full'
                        style={{
                          backgroundColor: `var(--color-${entry.status})`,
                        }}
                      />

                      <span className='text-muted-foreground'>
                        {formatChoiceFieldValue(entry.status)}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <span className='font-semibold tabular-nums'>
                        {entry.count}
                      </span>

                      <span className='text-muted-foreground w-9 text-right text-xs tabular-nums'>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyChartState label='No data available yet' />
        )}
      </CardContent>
    </Card>
  );
};

export default StatusPieCard;
