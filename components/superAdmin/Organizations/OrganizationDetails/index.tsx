'use client';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useParams } from 'next/navigation';
import OrganizationDetailsContent from './OrganizationDetailsContent/OrganizationDetailsContent';

const OrganizationDetailsContainer: React.FC = () => {
  const { dict } = useTranslation();
  const { organizationuid } = useParams();
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: dict.nav.dashboard, href: `/super-admin/dashboard` },
          { label: dict.nav.organizations, href: `/super-admin/organizations` },
          {
            label: dict.organizations.detail.breadcrumb,
            href: `/super-admin/organizations/${organizationuid}`,
          },
        ]}
      />
      <OrganizationDetailsContent />
    </div>
  );
};

export default OrganizationDetailsContainer;
