'use client';

import { ChartConfig } from '@/components/ui/chart';
import { useGetHomeopathyDashboardDataQuery } from '@/lib/services/endpoints/organization/Homeopathy/Dashboard/DashboardApi';
import { AlertTriangle, CalendarCheck, TrendingUp } from 'lucide-react';
import { buildStatusConfig } from '../../../../common/chartConfig';
import GrowthChartCard from './DashboardComponents/GrowthChartCard';
import StatCards from './DashboardComponents/StatCards';
import StatusPieCard from './DashboardComponents/StatusPieCard';

const patientGrowthConfig = {
  count: {
    label: 'Patients',
    color: 'var(--color-chart-1)',
  },
} satisfies ChartConfig;

const appointmentGrowthConfig = {
  count: {
    label: 'Appointments',
    color: 'var(--color-secondary)',
  },
} satisfies ChartConfig;

const DashboardContent: React.FC = () => {
  const { data, isLoading, isError } =
    useGetHomeopathyDashboardDataQuery(undefined);

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

        <p className='mt-3 text-sm font-medium'>Failed to load dashboard</p>

        <p className='text-muted-foreground mt-1 max-w-xs text-sm'>
          Something went wrong while loading the dashboard overview.
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

  const patientStatusConfig = buildStatusConfig(patient_status);
  const medicineStatusConfig = buildStatusConfig(medicine_status);

  return (
    <div className='flex flex-col gap-4'>
      {/* HEADER */}
      <div>
        <h1 className='text-xl font-semibold tracking-tight'>
          Dashboard Overview
        </h1>

        <p className='text-muted-foreground mt-1 text-sm'>
          A quick snapshot of your homeopathy practice at a glance.
        </p>
      </div>

      {/* STAT CARDS */}
      <StatCards summary={summary} />

      {/* GROWTH CHARTS */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <GrowthChartCard
          title='Patient Growth'
          description='New patient registrations over time'
          icon={TrendingUp}
          iconClassName='text-primary'
          data={patient_growth}
          config={patientGrowthConfig}
          gradientId='patientGrowthFill'
          emptyLabel='No patient growth data yet'
        />

        <GrowthChartCard
          title='Appointment Growth'
          description='Appointments booked over time'
          icon={CalendarCheck}
          iconClassName='text-secondary'
          data={appointment_growth}
          config={appointmentGrowthConfig}
          gradientId='appointmentGrowthFill'
          emptyLabel='No appointment growth data yet'
        />
      </div>

      {/* STATUS BREAKDOWNS */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <StatusPieCard
          title='Patient Status'
          description='Distribution of patients by status'
          data={patient_status}
          config={patientStatusConfig}
        />

        <StatusPieCard
          title='Medicine Status'
          description='Distribution of medicines by availability'
          data={medicine_status}
          config={medicineStatusConfig}
        />
      </div>
    </div>
  );
};

export default DashboardContent;
