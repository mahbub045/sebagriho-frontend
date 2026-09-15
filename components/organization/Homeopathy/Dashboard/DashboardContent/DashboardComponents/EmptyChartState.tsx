import { TrendingUp } from 'lucide-react';

const EmptyChartState: React.FC<{ label: string }> = ({ label }) => (
  <div className='border-border flex h-64 flex-col items-center justify-center rounded-lg border border-dashed'>
    <TrendingUp className='text-muted-foreground/40 h-8 w-8' />

    <p className='text-muted-foreground mt-2 text-sm'>{label}</p>
  </div>
);

export default EmptyChartState;
