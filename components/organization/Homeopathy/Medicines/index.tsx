import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { getDictionary } from '@/lib/i18n/getDictionary';
import MedicineList from './MedicineList/MedicineList';

const HomeopathyMedicinesContainer = async () => {
  const dict = await getDictionary();

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
        ]}
      />
      <MedicineList />
    </div>
  );
};

export default HomeopathyMedicinesContainer;
