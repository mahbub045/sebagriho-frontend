'use client';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useParams } from 'next/navigation';
import AppointmentDetailsContent from './AppointmentDetailsContent/AppointmentDetailsContent';

const HomeopathyAppointmentDetailsContainer: React.FC = () => {
  const { appointmentuid } = useParams();
  const { dict } = useTranslation();

  return (
    <div>
      <Breadcrumbs
        items={[
          {
            label: dict.nav.dashboard,
            href: `/organization/homeopathy/dashboard`,
          },
          {
            label: dict.nav.appointments,
            href: `/organization/homeopathy/appointments`,
          },
          {
            label: dict.appointments.details.breadcrumb,
            href: `/organization/homeopathy/appointments/${appointmentuid}`,
          },
        ]}
      />
      <AppointmentDetailsContent />
    </div>
  );
};

export default HomeopathyAppointmentDetailsContainer;
