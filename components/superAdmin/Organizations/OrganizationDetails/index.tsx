'use client';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { useParams } from 'next/navigation';
import OrganizationDetailsContent from './OrganizationDetailsContent/OrganizationDetailsContent';

const OrganizationDetailsContainer: React.FC = () => {
  const { organizationuid } = useParams();
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/super-admin/dashboard` },
          { label: 'Organizations', href: `/super-admin/organizations` },
          {
            label: 'Organization Details',
            href: `/super-admin/organizations/${organizationuid}`,
          },
        ]}
      />
      <OrganizationDetailsContent />
    </div>
  );
};

export default OrganizationDetailsContainer;
