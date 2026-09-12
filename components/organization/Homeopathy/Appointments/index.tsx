import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import AppointmentList from './AppointmentList/AppointmentList';

const HomeopathyAppointmentsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/organization/homeopathy/dashboard` },
          {
            label: 'Appointments',
            href: `/organization/homeopathy/appointments`,
          },
        ]}
      />
      <AppointmentList />
    </div>
  );
};

export default HomeopathyAppointmentsContainer;
