import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import OrganizationList from './OrganizationList/OrganizationList';

const OrganizationsContainer: React.FC = () => {
  return (
    <div>
     <Breadcrumbs
        items={[
          { label: 'Organizations', href: '/organizations' },
          { label: 'Organization Details', href: '/organizations/details' },
        ]}
      />
      <OrganizationList />
    </div>
  );
};

export default OrganizationsContainer;
