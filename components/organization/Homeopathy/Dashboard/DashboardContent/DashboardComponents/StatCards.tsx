import { Card, CardContent } from '@/components/ui/card';
import { DashboardSummary } from '@/types/Organization/Homeopathy/Dashboard/DashboardType';
import {
  Activity,
  CalendarCheck,
  CalendarDays,
  LucideIcon,
  Pill,
  Users,
} from 'lucide-react';

interface StatCardData {
  label: string;
  value: number;
  subLabel: string;
  icon: LucideIcon;
  accent: string;
  iconBg: string;
}

const StatCards: React.FC<{ summary: DashboardSummary }> = ({ summary }) => {
  const statCards: StatCardData[] = [
    {
      label: 'Total Patients',
      value: summary.total_patients,
      subLabel: 'All registered patients',
      icon: Users,
      accent: 'text-primary',
      iconBg: 'bg-primary/10',
    },

    {
      label: 'Total Appointments',
      value: summary.total_appointments,
      subLabel: 'All appointments',
      icon: CalendarDays,
      accent: 'text-secondary',
      iconBg: 'bg-secondary/10',
    },
    {
      label: "Today's Appointments",
      value: summary.today_appointments,
      subLabel: 'Scheduled today',
      icon: CalendarCheck,
      accent: 'text-secondary',
      iconBg: 'bg-secondary/10',
    },
    {
      label: 'Total Medicines',
      value: summary.total_medicines,
      subLabel: 'All medicines',
      icon: Pill,
      accent: 'text-success',
      iconBg: 'bg-success/10',
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {statCards.map((stat) => (
        <Card
          glow
          key={stat.label}
          className='border-border/60 gap-3 shadow-sm'
        >
          <CardContent className='flex items-center gap-4'>
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}
            >
              <stat.icon className={`h-6 w-6 ${stat.accent}`} />
            </div>

            <div className='min-w-0'>
              <p className='text-muted-foreground text-sm'>{stat.label}</p>

              <p className='text-2xl font-semibold tracking-tight tabular-nums'>
                {stat.value.toLocaleString()}
              </p>

              <div className='mt-0.5 flex items-center gap-1'>
                <Activity className={`h-3 w-3 ${stat.accent}`} />

                <span className='text-muted-foreground text-xs'>
                  {stat.subLabel}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatCards;
