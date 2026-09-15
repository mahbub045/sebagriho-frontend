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

import { MonthlyGrowthPoint } from '@/types/Organization/Homeopathy/Dashboard/DashboardType';
import { LucideIcon } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import EmptyChartState from './EmptyChartState';

interface GrowthChartCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
  data: MonthlyGrowthPoint[];
  config: ChartConfig;
  gradientId: string;
  emptyLabel: string;
}

const GrowthChartCard: React.FC<GrowthChartCardProps> = ({
  title,
  description,
  icon: Icon,
  iconClassName,
  data,
  config,
  gradientId,
  emptyLabel,
}) => {
  return (
    <Card className='border-border/60 shadow-sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Icon className={`h-4 w-4 ${iconClassName}`} />
          {title}
        </CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={config} className='aspect-auto h-64 w-full'>
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-count)'
                    stopOpacity={0.35}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-count)'
                    stopOpacity={0.03}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <XAxis
                dataKey='month'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <ChartTooltip content={<ChartTooltipContent hideLabel />} />

              <Area
                dataKey='count'
                type='monotone'
                fill={`url(#${gradientId})`}
                stroke='var(--color-count)'
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <EmptyChartState label={emptyLabel} />
        )}
      </CardContent>
    </Card>
  );
};

export default GrowthChartCard;
