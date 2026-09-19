import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { getDictionary } from '@/lib/i18n/getDictionary';
import PatientList from './PatientList/PatientList';

const HomeopathyPatientsContainer = async () => {
  const dict = await getDictionary();
  return (
    <div>
      <Breadcrumbs
        items={[
          {
            label: dict.nav.dashboard,
            href: `/organization/homeopathy/dashboard`,
          },
          { label: dict.nav.patients, href: `/organization/homeopathy/patients` },
        ]}
      />
      <PatientList />
    </div>
  );
};

export default HomeopathyPatientsContainer;
