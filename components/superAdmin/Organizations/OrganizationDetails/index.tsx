import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { useParams } from 'next/navigation';

const OrganizationDetailsContainer: React.FC = () => {
  const { organizationslug } = useParams();
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Organizations', href: `/super-admin/organizations` },
          {
            label: 'Organization Details',
            href: `/super-admin/organizations/${organizationslug}`,
          },
        ]}
      />
    </div>
  );
};

export default OrganizationDetailsContainer;
