import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import OrganizationCards from './OrganizationCards/OrganizationCards';

const OrganizationsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[{ label: 'Organizations', href: `/super-admin/organizations` }]}
      />

      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Organizations</h1>
          <p className='text-muted-foreground'>
            Welcome to the Organizations page
          </p>
        </div>
        <div>
          <Button>
            <Plus />
            Add Organization
          </Button>
        </div>
      </div>

      <OrganizationCards />
    </div>
  );
};

export default OrganizationsContainer;
