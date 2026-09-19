'use client';

import { ChartConfig } from '@/components/ui/chart';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useGetHomeopathyDashboardDataQuery } from '@/lib/services/endpoints/organization/Homeopathy/Dashboard/DashboardApi';
import { AlertTriangle, CalendarCheck, TrendingUp } from 'lucide-react';
import GrowthChartCard from './DashboardComponents/GrowthChartCard';
import StatCards from './DashboardComponents/StatCards';

const DashboardContent: React.FC = () => {
  const { dict } = useTranslation();
  const { data, isLoading, isError } =
    useGetHomeopathyDashboardDataQuery(undefined);

  const patientGrowthConfig = {
    count: {
      label: dict.dashboard.homeopathy.patientsSeriesLabel,
      color: 'var(--color-chart-1)',
    },
  } satisfies ChartConfig;

  const appointmentGrowthConfig = {
    count: {
      label: dict.dashboard.homeopathy.appointmentsSeriesLabel,
      color: 'var(--color-secondary)',
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className='bg-muted h-32 animate-pulse rounded-xl'
            />
          ))}
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className='bg-muted h-80 animate-pulse rounded-xl'
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className='border-danger/40 flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center'>
        <AlertTriangle className='text-danger/50 h-10 w-10' />

        <p className='mt-3 text-sm font-medium'>
          {dict.dashboard.homeopathy.failedToLoad}
        </p>

        <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
          {dict.dashboard.homeopathy.failedToLoadDescription}
        </p>
      </div>
    );
  }

  const {
    summary,
    patient_growth,
    appointment_growth,
    patient_status,
    medicine_status,
  } = data;

  return (
    <div className='flex flex-col gap-4'>
      {/* HEADER */}
      <div>
        <h1 className='text-xl font-semibold tracking-tight'>
          {dict.dashboard.homeopathy.title}
        </h1>

        <p className='text-muted-foreground mt-1 text-sm'>
          {dict.dashboard.homeopathy.subtitle}
        </p>
      </div>

      {/* STAT CARDS */}
      <StatCards summary={summary} />

      {/* GROWTH CHARTS */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <GrowthChartCard
          title={dict.dashboard.homeopathy.patientGrowthTitle}
          description={dict.dashboard.homeopathy.patientGrowthDescription}
          icon={TrendingUp}
          iconClassName='text-primary'
          data={patient_growth}
          config={patientGrowthConfig}
          gradientId='patientGrowthFill'
          emptyLabel={dict.dashboard.homeopathy.patientGrowthEmpty}
        />

        <GrowthChartCard
          title={dict.dashboard.homeopathy.appointmentGrowthTitle}
          description={dict.dashboard.homeopathy.appointmentGrowthDescription}
          icon={CalendarCheck}
          iconClassName='text-secondary'
          data={appointment_growth}
          config={appointmentGrowthConfig}
          gradientId='appointmentGrowthFill'
          emptyLabel={dict.dashboard.homeopathy.appointmentGrowthEmpty}
        />
      </div>
    </div>
  );
};

export default DashboardContent;
