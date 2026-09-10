import { Skeleton } from '@/components/ui/skeleton';

const MedicineDetailsSkeleton: React.FC = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='h-32 w-full rounded-lg bg-gray-100 dark:bg-black' />
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Skeleton className='h-40 w-full rounded-lg bg-gray-100 dark:bg-black' />
        <Skeleton className='h-40 w-full rounded-lg bg-gray-100 dark:bg-black' />
      </div>
      <Skeleton className='h-24 w-full rounded-lg bg-gray-100 dark:bg-black' />
    </div>
  );
};

export default MedicineDetailsSkeleton;
