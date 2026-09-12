'use client';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { useParams } from 'next/navigation';
import AppointmentDetailsContent from './AppointmentDetailsContent/AppointmentDetailsContent';

const HomeopathyAppointmentDetailsContainer: React.FC = () => {
  const { appointmentuid } = useParams();
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/organization/homeopathy/dashboard` },
          {
            label: 'Appointments',
            href: `/organization/homeopathy/appointments`,
          },
          {
            label: 'Appointment Details',
            href: `/organization/homeopathy/appointments/${appointmentuid}`,
          },
        ]}
      />
      <AppointmentDetailsContent />
    </div>
  );
};

export default HomeopathyAppointmentDetailsContainer;
