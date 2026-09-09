'use client';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { useParams } from 'next/navigation';
import PatientDetailsContents from './PatientDetailsContents/PatientDetailsContents';

const HomeopathyPatientDetailsContainer: React.FC = () => {
  const { patientuid } = useParams();
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/organization/homeopathy/dashboard` },
          { label: 'Patients', href: `/organization/homeopathy/patients` },
          {
            label: 'Patient Details',
            href: `/organization/homeopathy/patients/${patientuid}`,
          },
        ]}
      />
      <PatientDetailsContents />
    </div>
  );
};

export default HomeopathyPatientDetailsContainer;
