'use client';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddOrganizationDialog from './Dialogs/AddOrganizationDialog';
import OrganizationList from './OrganizationList/OrganizationList';

const OrganizationsContainer: React.FC = () => {
  const [isAddOrganizationDialogOpen, setIsAddOrganizationDialogOpen] =
    useState(false);

  const handleAddOrganizationClick = () => {
    setIsAddOrganizationDialogOpen(true);
  };
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: `/super-admin/dashboard` },
          { label: 'Organizations', href: `/super-admin/organizations` },
        ]}
      />

      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Organizations</h1>
          <p className='text-muted-foreground'>
            Welcome to the Organizations page
          </p>
        </div>
        <div>
          <Button onClick={handleAddOrganizationClick}>
            <Plus />
            Add Organization
          </Button>
        </div>
      </div>

      <OrganizationList />

      {/* Dialog  */}
      <AddOrganizationDialog
        isOpen={isAddOrganizationDialogOpen}
        onClose={() => setIsAddOrganizationDialogOpen(false)}
      />
    </div>
  );
};

export default OrganizationsContainer;
