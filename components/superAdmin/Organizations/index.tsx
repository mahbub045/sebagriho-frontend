import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import OrganizationCards from './OrganizationCards/OrganizationCards';

const OrganizationsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[{ label: 'Organizations', href: `/super-admin/organizations` }]}
      />

      <div>
        <h1 className="text-2xl font-bold">Organizations</h1>
        <p className="text-muted-foreground">Welcome to the Organizations page</p>
      </div>

      <OrganizationCards />
    </div>
  );
};

export default OrganizationsContainer;
