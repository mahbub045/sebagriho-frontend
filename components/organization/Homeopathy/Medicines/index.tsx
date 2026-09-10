import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import MedicineList from './MedicineList/MedicineList';

const HomeopathyMedicinesContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/organization/homeopathy/dashboard` },
          { label: 'Medicines', href: `/organization/homeopathy/medicines` },
        ]}
      />
      <MedicineList />
    </div>
  );
};

export default HomeopathyMedicinesContainer;
