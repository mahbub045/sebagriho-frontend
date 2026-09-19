'use client';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useParams } from 'next/navigation';
import PatientDetailsContents from './PatientDetailsContents/PatientDetailsContents';

const HomeopathyPatientDetailsContainer: React.FC = () => {
  const { patientuid } = useParams();
  const { dict } = useTranslation();
  return (
    <div>
      <Breadcrumbs
        items={[
          {
            label: dict.nav.dashboard,
            href: `/organization/homeopathy/dashboard`,
          },
          { label: dict.nav.patients, href: `/organization/homeopathy/patients` },
          {
            label: dict.patients.breadcrumbs.patientDetails,
            href: `/organization/homeopathy/patients/${patientuid}`,
          },
        ]}
      />
      <PatientDetailsContents />
    </div>
  );
};

export default HomeopathyPatientDetailsContainer;
