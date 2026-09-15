import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import DashboardContent from './DashboardContent/DashboardContent';

const HomeopathyDashboardContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/organization/homeopathy/dashboard` },
        ]}
      />

      <DashboardContent />
    </div>
  );
};

export default HomeopathyDashboardContainer;
