import { ChartConfig } from '@/components/ui/chart';
import { formatChoiceFieldValue } from '@/utils/formatters';

export const STATUS_COLORS = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-success)',
  'var(--color-warning)',
  'var(--color-info)',
  'var(--color-danger)',
];

export const buildStatusConfig = (
  statuses: { status: string }[],
): ChartConfig =>
  statuses.reduce((config, item, index) => {
    config[item.status] = {
      label: formatChoiceFieldValue(item.status),
      color: STATUS_COLORS[index % STATUS_COLORS.length],
    };
    return config;
  }, {} as ChartConfig);
