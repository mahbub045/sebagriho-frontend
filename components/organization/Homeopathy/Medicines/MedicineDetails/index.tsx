'use client';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { useParams } from 'next/navigation';
import MedicineDetailsContents from './MedicineDetailsContents/MedicineDetailsContents';

const HomeopathyMedicineDetailsContainer: React.FC = () => {
  const { medicineuid } = useParams();
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/organization/homeopathy/dashboard` },
          { label: 'Medicines', href: `/organization/homeopathy/medicines` },
          {
            label: 'Medicine Details',
            href: `/organization/homeopathy/medicines/${medicineuid}`,
          },
        ]}
      />
      <MedicineDetailsContents />
    </div>
  );
};

export default HomeopathyMedicineDetailsContainer;
