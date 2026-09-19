'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useUpdateProfileInfoMutation } from '@/lib/services/endpoints/common/ProfileInfoApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ProfileInfo } from '@/types/common/CommonTypes';
import { getInitials } from '@/utils/formatters';
import { Camera } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

type Props = {
  profile: ProfileInfo;
};

const ProfileOverviewCard: React.FC<Props> = ({ profile }) => {
  const { dict } = useTranslation();
  const [updateProfileInfo, { isLoading }] = useUpdateProfileInfoMutation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));

    const payload = new FormData();
    payload.append('avatar', file);

    try {
      await updateProfileInfo(payload).unwrap();
      toast.success(dict.profileSettings.overview.photoUpdateSuccess);
    } catch {
      toast.error(dict.profileSettings.overview.photoUpdateError);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <Card className='border-border/60 items-center p-5 text-center shadow-sm'>
      <div className='relative'>
        <Avatar className='h-20 w-20'>
          <AvatarImage
            src={previewUrl ?? profile.avatar ?? undefined}
            alt={profile.name}
          />
          <AvatarFallback className='bg-primary/5 text-primary text-xl font-semibold'>
            {getInitials(profile.first_name, profile.last_name)}
          </AvatarFallback>
        </Avatar>

        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className='bg-primary text-primary-foreground ring-background absolute right-0 bottom-0 flex h-7 w-7 items-center justify-center rounded-full ring-2 disabled:opacity-50'
        >
          {isLoading ? <Loading size={14} className='text-white!' /> : <Camera className='h-3.5 w-3.5' />}
        </button>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleAvatarChange}
        />
      </div>

      <div className='mt-3'>
        <p className='text-sm font-semibold'>{profile.name}</p>
        <p className='text-muted-foreground mt-0.5 text-xs'>{profile.email}</p>
      </div>

      {(profile.is_owner || profile.is_admin) && (
        <div className='mt-2 flex items-center justify-center gap-1.5'>
          {profile.is_owner && (
            <Badge variant='outline' className='text-[11px] font-medium'>
              {dict.profileSettings.overview.owner}
            </Badge>
          )}
          {profile.is_admin && (
            <Badge variant='outline' className='text-[11px] font-medium'>
              {dict.profileSettings.overview.admin}
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
};

export default ProfileOverviewCard;
