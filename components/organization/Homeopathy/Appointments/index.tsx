import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { getDictionary } from '@/lib/i18n/getDictionary';
import AppointmentList from './AppointmentList/AppointmentList';

const HomeopathyAppointmentsContainer = async () => {
  const dict = await getDictionary();

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
        ]}
      />
      <AppointmentList />
    </div>
  );
};

export default HomeopathyAppointmentsContainer;
