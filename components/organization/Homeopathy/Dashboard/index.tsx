import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { getDictionary } from '@/lib/i18n/getDictionary';
import DashboardContent from './DashboardContent/DashboardContent';

const HomeopathyDashboardContainer = async () => {
  const dict = await getDictionary();

  return (
    <div>
      <Breadcrumbs
        items={[
          {
            label: dict.nav.dashboard,
            href: `/organization/homeopathy/dashboard`,
          },
        ]}
      />

      <DashboardContent />
    </div>
  );
};

export default HomeopathyDashboardContainer;
