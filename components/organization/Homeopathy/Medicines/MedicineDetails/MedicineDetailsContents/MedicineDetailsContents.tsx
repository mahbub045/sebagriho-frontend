'use client';

import { useParams } from 'next/navigation';

import { useGetMedicineDetailsQuery } from '@/lib/services/endpoints/organization/Homeopathy/Medicines/MedicinesApi';
import DeleteCard from './DeleteCard/DeleteCard';
import MedicineDescriptionCard from './MedicineDescriptionCard/MedicineDescriptionCard';
import MedicineDetailsSkeleton from './MedicineDetailsSkeleton/MedicineDetailsSkeleton';
import MedicineFilesCard from './MedicineFilesCard/MedicineFilesCard';
import MedicineInventoryCard from './MedicineInventoryCard/MedicineInventoryCard';
import MedicineOverviewCard from './MedicineOverviewCard/MedicineOverviewCard';

const MedicineDetailsContents: React.FC = () => {
  const { medicineuid } = useParams();

  const {
    data: medicine,
    isLoading,
    isError,
  } = useGetMedicineDetailsQuery(medicineuid as string);

  if (isLoading) {
    return <MedicineDetailsSkeleton />;
  }

  if (isError || !medicine) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-danger text-sm'>
          Failed to load medicine details. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <MedicineOverviewCard medicine={medicine} />

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <MedicineInventoryCard medicine={medicine} />
        <MedicineFilesCard medicine={medicine} />
      </div>

      <MedicineDescriptionCard medicine={medicine} />
      <DeleteCard medicine={medicine} />
    </div>
  );
};

export default MedicineDetailsContents;
