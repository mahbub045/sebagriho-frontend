'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BLOOD_GROUP_OPTIONS,
  GENDER_OPTIONS,
} from '@/data/common/ChoiceFields';
import { useUpdateProfileInfoMutation } from '@/lib/services/endpoints/common/ProfileInfoApi';
import {
  ProfileFieldErrors,
  ProfileFormData,
  ProfileInfo,
} from '@/types/common/CommonTypes';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  profile: ProfileInfo;
};

const buildFormData = (profile: ProfileInfo): ProfileFormData => ({
  first_name: profile.first_name ?? '',
  last_name: profile.last_name ?? '',
  phone: profile.phone ?? '',
  email: profile.email ?? '',
  gender: profile.gender ?? '',
  blood_group: profile.blood_group ?? '',
  date_of_birth: profile.date_of_birth ?? '',
  nid: profile.nid ?? '',
});

const ProfileInfoForm: React.FC<Props> = ({ profile }) => {
  const [updateProfileInfo, { isLoading, isError, error }] =
    useUpdateProfileInfoMutation();

  const [formData, setFormData] = useState<ProfileFormData>(() =>
    buildFormData(profile),
  );

  const fieldErrors: ProfileFieldErrors =
    (error as { data?: ProfileFieldErrors })?.data ?? {};

  const getFieldError = (field: keyof ProfileFormData) => {
    const value = fieldErrors[field];
    return Array.isArray(value) ? value[0] : value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateField = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('first_name', formData.first_name);
    payload.append('last_name', formData.last_name);
    payload.append('email', formData.email);
    payload.append('gender', formData.gender);
    payload.append('blood_group', formData.blood_group);
    payload.append('date_of_birth', formData.date_of_birth);
    payload.append('nid', formData.nid);

    try {
      await updateProfileInfo(payload).unwrap();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile. Please check the form.');
    }
  };

  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 border-b p-4'>
        <h3 className='text-sm font-semibold'>
          Personal Information &amp; Identification
        </h3>
        <p className='text-muted-foreground mt-0.5 text-xs'>
          Your name as it will appear across the platform.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='first_name'>
              First Name <span className='text-destructive'>*</span>
            </Label>
            <Input
              type='text'
              id='first_name'
              name='first_name'
              value={formData.first_name}
              onChange={handleChange}
              aria-invalid={!!getFieldError('first_name')}
            />
            {getFieldError('first_name') && (
              <p className='text-destructive text-xs'>
                {getFieldError('first_name')}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='last_name'>
              Last Name <span className='text-destructive'>*</span>
            </Label>
            <Input
              type='text'
              id='last_name'
              name='last_name'
              value={formData.last_name}
              onChange={handleChange}
              aria-invalid={!!getFieldError('last_name')}
            />
            {getFieldError('last_name') && (
              <p className='text-destructive text-xs'>
                {getFieldError('last_name')}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='phone'>Phone</Label>
            <Input
              id='phone'
              name='phone'
              placeholder='Phone'
              value={formData.phone}
              disabled
            />
            {getFieldError('phone') && (
              <p className='text-destructive text-xs'>
                {getFieldError('phone')}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              aria-invalid={!!getFieldError('email')}
            />
            {getFieldError('email') && (
              <p className='text-destructive text-xs'>
                {getFieldError('email')}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='gender'>Gender</Label>
            <Select
              items={GENDER_OPTIONS}
              id='gender'
              name='gender'
              value={formData.gender}
              onValueChange={(value) =>
                updateField('gender', (value as string) ?? '')
              }
            >
              <SelectTrigger
                id='gender'
                className='w-full'
                aria-invalid={!!getFieldError('gender')}
              >
                <SelectValue placeholder='Select a gender' />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('gender') && (
              <p className='text-destructive text-xs'>
                {getFieldError('gender')}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='blood_group'>Blood Group</Label>
            <Select
              items={BLOOD_GROUP_OPTIONS}
              id='blood_group'
              name='blood_group'
              value={formData.blood_group}
              onValueChange={(value) =>
                updateField('blood_group', (value as string) ?? '')
              }
            >
              <SelectTrigger
                id='blood_group'
                className='w-full'
                aria-invalid={!!getFieldError('blood_group')}
              >
                <SelectValue placeholder='Select blood group' />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUP_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('blood_group') && (
              <p className='text-destructive text-xs'>
                {getFieldError('blood_group')}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='date_of_birth'>Date of Birth</Label>
            <Input
              id='date_of_birth'
              name='date_of_birth'
              type='date'
              value={formData.date_of_birth}
              onChange={handleChange}
              aria-invalid={!!getFieldError('date_of_birth')}
            />
            {getFieldError('date_of_birth') && (
              <p className='text-destructive text-xs'>
                {getFieldError('date_of_birth')}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='nid'>NID Number</Label>
            <Input
              type='text'
              id='nid'
              name='nid'
              placeholder='NID Number'
              value={formData.nid}
              onChange={handleChange}
              aria-invalid={!!getFieldError('nid')}
            />
            {getFieldError('nid') && (
              <p className='text-destructive text-xs'>{getFieldError('nid')}</p>
            )}
          </div>
        </div>

        {isError &&
          (fieldErrors as { non_field_errors?: string[] })
            ?.non_field_errors && (
            <p className='text-destructive text-sm'>
              {
                (fieldErrors as { non_field_errors?: string[] })
                  .non_field_errors?.[0]
              }
            </p>
          )}

        <div className='flex justify-end'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <Loading size={14} className='text-white!' />
            ) : (
              <Edit />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileInfoForm;
