'use client';

import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { useTranslation } from '@/lib/i18n/useTranslation';

const SuperAdminDashboardContainer: React.FC = () => {
  const { dict } = useTranslation();

  return (
    <div>
      <Breadcrumbs items={[{ label: dict.nav.dashboard }]} />
    </div>
  );
};

export default SuperAdminDashboardContainer;
