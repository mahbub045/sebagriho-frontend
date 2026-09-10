import { Skeleton } from '@/components/ui/skeleton';

const MedicineDetailsSkeleton: React.FC = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='h-32 w-full rounded-lg' />
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Skeleton className='h-40 w-full rounded-lg' />
        <Skeleton className='h-40 w-full rounded-lg' />
      </div>
      <Skeleton className='h-24 w-full rounded-lg' />
    </div>
  );
};

export default MedicineDetailsSkeleton;
