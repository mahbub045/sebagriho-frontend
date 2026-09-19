'use client';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useParams } from 'next/navigation';
import MedicineDetailsContents from './MedicineDetailsContents/MedicineDetailsContents';

const HomeopathyMedicineDetailsContainer: React.FC = () => {
  const { medicineuid } = useParams();
  const { dict } = useTranslation();
  return (
    <div>
      <Breadcrumbs
        items={[
          {
            label: dict.medicines.breadcrumbs.dashboard,
            href: `/organization/homeopathy/dashboard`,
          },
          {
            label: dict.medicines.breadcrumbs.medicines,
            href: `/organization/homeopathy/medicines`,
          },
          {
            label: dict.medicines.breadcrumbs.medicineDetails,
            href: `/organization/homeopathy/medicines/${medicineuid}`,
          },
        ]}
      />
      <MedicineDetailsContents />
    </div>
  );
};

export default HomeopathyMedicineDetailsContainer;
