'use client';
import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddOrganizationDialog from './Dialogs/AddOrganizationDialog';
import OrganizationList from './OrganizationList/OrganizationList';

const OrganizationsContainer: React.FC = () => {
  const { dict } = useTranslation();
  const [isAddOrganizationDialogOpen, setIsAddOrganizationDialogOpen] =
    useState(false);

  const handleAddOrganizationClick = () => {
    setIsAddOrganizationDialogOpen(true);
  };
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: dict.nav.dashboard, href: `/super-admin/dashboard` },
          { label: dict.nav.organizations, href: `/super-admin/organizations` },
        ]}
      />

      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>
            {dict.organizations.list.title}
          </h1>
          <p className='text-muted-foreground'>
            {dict.organizations.list.subtitle}
          </p>
        </div>
        <div>
          <Button onClick={handleAddOrganizationClick}>
            <Plus />
            {dict.organizations.list.addOrganization}
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
