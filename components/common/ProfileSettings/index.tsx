'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { useGetProfileInfoQuery } from '@/lib/services/endpoints/common/ProfileInfoApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ProfileInfo } from '@/types/common/CommonTypes';
import ProfileInfoForm from './ProfileInfoForm';
import ProfileOverviewCard from './ProfileOverviewCard';
import SecurityCard from './SecurityCard';

const ProfileSettingsContainer: React.FC = () => {
  const { data, isLoading, isError } = useGetProfileInfoQuery(undefined);
  const profile = data as ProfileInfo | undefined;
  const { dict } = useTranslation();

  return (
    <div>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold'>
          {dict.profileSettings.pageTitle}
        </h2>
        <p className='text-muted-foreground text-sm'>
          {dict.profileSettings.pageDescription}
        </p>
      </div>

      {isLoading && (
        <div className='flex items-center justify-center py-20'>
          <Loading size={24} />
        </div>
      )}

      {!isLoading && isError && (
        <p className='text-destructive text-sm'>
          {dict.profileSettings.loadError}
        </p>
      )}

      {!isLoading && !isError && profile && (
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <ProfileInfoForm key={profile.uid} profile={profile} />
          </div>

          <div className='flex flex-col gap-4'>
            <ProfileOverviewCard profile={profile} />
            <SecurityCard />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettingsContainer;
