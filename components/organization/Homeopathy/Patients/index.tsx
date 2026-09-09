import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import PatientList from './PatientList/PatientList';

const HomeopathyPatientsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/homeopathy/dashboard` },
          { label: 'Patients', href: `/homeopathy/patients` },
        ]}
      />
      <PatientList />
    </div>
  );
};

export default HomeopathyPatientsContainer;
