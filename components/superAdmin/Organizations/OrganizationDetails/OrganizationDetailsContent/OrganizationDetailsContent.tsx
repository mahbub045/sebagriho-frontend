'use client';

import CustomErrorMessage from '@/components/common/CustomErrorMessage/CustomErrorMessage';
import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { useGetOrganizationDetailsQuery } from '@/lib/services/endpoints/superAdmin/Organizations/OrganizationsApi';
import { Edit } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import DeleteCard from './DeleteCard/DeleteCard';
import UpdateOrganizationDialog from './Dialogs/UpdateOrganizationDialog';
import OrganizationAboutCard from './OrganizationAboutCard/OrganizationAboutCard';
import OrganizationHeroCard from './OrganizationHeroCard/OrganizationHeroCard';
import OrganizationOwnerCard from './OrganizationOwnerCard/OrganizationOwnerCard';
import OrganizationSocialCard from './OrganizationSocialCard/OrganizationSocialCard';

const OrganizationDetailsContent: React.FC = () => {
  const { organizationuid } = useParams();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = React.useState(false);

  const handleUpdateDialogOpen = () => {
    setIsUpdateDialogOpen(true);
  };

  const {
    data: details,
    isLoading,
    isError,
  } = useGetOrganizationDetailsQuery(organizationuid);

  if (isLoading) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center'>
        <Loading />
      </div>
    );
  }

  if (isError || !details) {
    return <CustomErrorMessage title='organization details' />;
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-end gap-4'>
        <Button variant='default' onClick={handleUpdateDialogOpen}>
          <Edit />
          Update Organization
        </Button>
      </div>
      <OrganizationHeroCard
        organization={details.organization}
        status={details.organization.status}
        joinedAt={details.joined_at}
        uid={details.uid}
      />

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        <div className='flex flex-col gap-4 lg:col-span-2'>
          <OrganizationAboutCard organization={details.organization} />
          <OrganizationSocialCard organization={details.organization} />
        </div>

        <div>
          <OrganizationOwnerCard user={details.user} />
        </div>
      </div>

      <DeleteCard
        organizationUid={details.uid}
        organizationName={details.organization.name}
      />
      {/* Dialogs  */}
      <UpdateOrganizationDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        organizationDetails={details}
      />
    </div>
  );
};

export default OrganizationDetailsContent;
