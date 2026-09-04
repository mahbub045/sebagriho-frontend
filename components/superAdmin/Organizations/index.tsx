import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import OrganizationList from './OrganizationList/OrganizationList';

const OrganizationsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[{ label: 'Organizations', href: `/super-admin/organizations` }]}
      />
      <OrganizationList />
    </div>
  );
};

export default OrganizationsContainer;
