'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  BLOOD_GROUP_OPTIONS,
  GENDER_OPTIONS,
  ORGANIZATION_STATUS_OPTIONS,
  ORGANIZATION_TYPE_OPTIONS,
} from '@/data/common/ChoiceFields';
import { TabKey } from '@/data/superAdmin/Organizations/OrganizationsData';
import { useUpdateOrganizationMutation } from '@/lib/services/endpoints/superAdmin/Organizations/OrganizationsApi';
import {
  OrganizationDetail,
  OrganizationOwner,
  UpdateOrganizationDialogProps,
} from '@/types/superAdmin/Organizations/OrganizationsType';
import { BdPhoneInput } from '@/utils/bdPhoneInput';
import { useEffect, useState } from 'react';

type OrgErrors = Partial<Record<keyof OrganizationDetail, string>>;
type UserErrors = Partial<Record<keyof OrganizationOwner, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

// Strip a leading +88 / 88 country code, leaving just the 11-digit local number.
const stripCountryCode = (phone: string | null) =>
  (phone ?? '').replace(/^\+?88/, '');

const extractApiFieldErrors = (error: unknown) => {
  const orgErrors: OrgErrors = {};
  const userErrors: UserErrors = {};

  const data =
    error && typeof error === 'object' && 'data' in error
      ? (error as { data?: unknown }).data
      : undefined;

  if (!data || typeof data !== 'object') {
    return { orgErrors, userErrors };
  }

  const flatten = (value: unknown): string | undefined => {
    if (Array.isArray(value)) return value.map(String).join(' ');
    if (typeof value === 'string') return value;
    return undefined;
  };

  const dataObj = data as Record<string, unknown>;

  if (dataObj.organization && typeof dataObj.organization === 'object') {
    Object.entries(dataObj.organization as Record<string, unknown>).forEach(
      ([key, value]) => {
        const msg = flatten(value);
        if (msg) orgErrors[key as keyof OrgErrors] = msg;
      },
    );
  }

  if (dataObj.user && typeof dataObj.user === 'object') {
    Object.entries(dataObj.user as Record<string, unknown>).forEach(
      ([key, value]) => {
        const msg = flatten(value);
        if (msg) userErrors[key as keyof UserErrors] = msg;
      },
    );
  }

  return { orgErrors, userErrors };
};

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className='text-danger mt-1 text-xs'>{message}</p> : null;

const UpdateOrganizationDialog: React.FC<UpdateOrganizationDialogProps> = ({
  isOpen,
  onClose,
  organizationDetails,
}) => {
  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();
  const [activeTab, setActiveTab] = useState<TabKey>('organization');
  const [orgForm, setOrgForm] = useState<OrganizationDetail>({
    name: '',
    organization_type: '',
    description: '',
    status: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    youtube: '',
  });
  const [userForm, setUserForm] = useState<OrganizationOwner>({
    uid: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    gender: '',
    nid: '',
    blood_group: '',
    date_of_birth: '',
  });
  const [orgErrors, setOrgErrors] = useState<OrgErrors>({});
  const [userErrors, setUserErrors] = useState<UserErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Re-hydrate the form whenever the dialog is opened for a given organization.
  useEffect(() => {
    if (!isOpen || !organizationDetails) return;

    const { organization, user, status } = organizationDetails;

    // Batch all state updates - React 18+ automatically batches these
    setOrgForm({
      name: organization.name ?? '',
      organization_type: organization.organization_type ?? '',
      description: organization.description ?? '',
      status: status ?? organization.status ?? '',
      phone: stripCountryCode(organization.phone),
      email: organization.email ?? '',
      website: organization.website ?? '',
      address: organization.address ?? '',
      facebook: organization.facebook ?? '',
      twitter: organization.twitter ?? '',
      linkedin: organization.linkedin ?? '',
      instagram: organization.instagram ?? '',
      youtube: organization.youtube ?? '',
    });

    setUserForm({
      uid: user.uid ?? '',
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      phone: stripCountryCode(user.phone),
      email: user.email ?? '',
      gender: user.gender ?? '',
      nid: user.nid ?? '',
      blood_group: user.blood_group ?? '',
      date_of_birth: user.date_of_birth ?? '',
    });

    setActiveTab('organization');
    setOrgErrors({});
    setUserErrors({});
    setSubmitError(null);
  }, [isOpen, organizationDetails]);

  const updateOrg = (
    field: keyof OrganizationDetail,
    value: string | null | undefined,
  ) => {
    setOrgForm((prev) => ({ ...prev, [field]: value ?? '' }));
    setOrgErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateUser = (
    field: keyof OrganizationOwner,
    value: string | null | undefined,
  ) => {
    setUserForm((prev) => ({ ...prev, [field]: value ?? '' }));
    setUserErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateOrganizationTab = () => {
    const errors: OrgErrors = {};
    if (!orgForm.name.trim()) errors.name = 'Organization name is required.';
    if (!orgForm.organization_type) {
      errors.organization_type = 'Organization type is required.';
    }
    if (orgForm.email && !EMAIL_REGEX.test(orgForm.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (orgForm.phone && !BD_PHONE_REGEX.test(orgForm.phone)) {
      errors.phone = 'Enter a valid 11-digit BD phone number.';
    }
    setOrgErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOwnerTab = () => {
    const errors: UserErrors = {};
    if (!userForm.first_name.trim())
      errors.first_name = 'First name is required.';
    if (!userForm.last_name.trim()) errors.last_name = 'Last name is required.';
    if (!userForm.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(userForm.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!userForm.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!BD_PHONE_REGEX.test(userForm.phone)) {
      errors.phone = 'Enter a valid 11-digit BD phone number.';
    }
    if (!userForm.gender) errors.gender = 'Gender is required.';
    setUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildPayload = () => ({
    user: {
      ...userForm,
      phone: userForm.phone ? `+88${userForm.phone}` : null,
      date_of_birth: userForm.date_of_birth || null,
      nid: userForm.nid || null,
      blood_group: userForm.blood_group || null,
    },
    organization: {
      ...orgForm,
      phone: orgForm.phone ? `+88${orgForm.phone}` : null,
    },
  });

  const applyApiErrors = (error: unknown) => {
    const { orgErrors: apiOrgErrors, userErrors: apiUserErrors } =
      extractApiFieldErrors(error);

    setOrgErrors((prev) => ({ ...prev, ...apiOrgErrors }));
    setUserErrors((prev) => ({ ...prev, ...apiUserErrors }));

    if (
      Object.keys(apiOrgErrors).length === 0 &&
      Object.keys(apiUserErrors).length === 0
    ) {
      setSubmitError(
        'Something went wrong. Please check your input and try again.',
      );
    } else if (Object.keys(apiOrgErrors).length > 0) {
      setActiveTab('organization');
    } else {
      setActiveTab('owner');
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    const isOrgValid = validateOrganizationTab();
    const isOwnerValid = validateOwnerTab();

    if (!isOrgValid) {
      setActiveTab('organization');
      return;
    }
    if (!isOwnerValid) {
      setActiveTab('owner');
      return;
    }

    try {
      await updateOrganization({
        organizationUid: organizationDetails.uid,
        organizationData: buildPayload(),
      }).unwrap();
      onClose();
    } catch (error) {
      applyApiErrors(error);
      console.error('Failed to update organization:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-h-[90vh] overflow-hidden p-4 sm:max-w-185'>
        <DialogHeader className='text-lg font-semibold'>
          <DialogTitle className='text-primary -mb-3 text-2xl'>
            Edit Organization
          </DialogTitle>
          <DialogDescription className='text-muted-foreground text-sm'>
            Update{' '}
            {organizationDetails?.organization?.name ?? 'this organization'}
            &apos;s details.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabKey)}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='organization' className='cursor-pointer'>
              Organization
            </TabsTrigger>
            <TabsTrigger value='owner' className='cursor-pointer'>
              Owner
            </TabsTrigger>
            <TabsTrigger value='social' className='cursor-pointer'>
              Social Links
            </TabsTrigger>
          </TabsList>

          <div>
            {/* Organization tab */}
            <TabsContent value='organization' className='mt-4 space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='org-name'>
                    Organization Name <span className='text-danger'>*</span>
                  </Label>
                  <Input
                    id='org-name'
                    type='text'
                    value={orgForm.name}
                    onChange={(e) => updateOrg('name', e.target.value)}
                    aria-invalid={!!orgErrors.name}
                  />
                  <FieldError message={orgErrors.name} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='org-type'>
                    Organization Type <span className='text-danger'>*</span>
                  </Label>
                  <Select
                    value={orgForm.organization_type}
                    onValueChange={(value) =>
                      updateOrg('organization_type', value)
                    }
                  >
                    <SelectTrigger
                      id='org-type'
                      className='w-full'
                      aria-invalid={!!orgErrors.organization_type}
                    >
                      <SelectValue placeholder='Select type'>
                        {
                          ORGANIZATION_TYPE_OPTIONS.find(
                            (option) =>
                              option.value === orgForm.organization_type,
                          )?.label
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ORGANIZATION_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={orgErrors.organization_type} />
                </div>
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='org-description'>Description</Label>
                <Textarea
                  id='org-description'
                  className='field-sizing-fixed'
                  value={orgForm.description}
                  onChange={(e) => updateOrg('description', e.target.value)}
                  rows={5}
                />
                <FieldError message={orgErrors.description} />
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='org-email'>Email</Label>
                  <Input
                    id='org-email'
                    type='email'
                    value={orgForm.email}
                    onChange={(e) => updateOrg('email', e.target.value)}
                    aria-invalid={!!orgErrors.email}
                  />
                  <FieldError message={orgErrors.email} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='org-phone'>Phone</Label>
                  <BdPhoneInput
                    id='org-phone'
                    value={orgForm.phone || ''}
                    onChange={(value) => updateOrg('phone', value)}
                  />
                  <FieldError message={orgErrors.phone} />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='org-website'>Website</Label>
                  <Input
                    id='org-website'
                    type='url'
                    value={orgForm.website}
                    onChange={(e) => updateOrg('website', e.target.value)}
                    aria-invalid={!!orgErrors.website}
                  />
                  <FieldError message={orgErrors.website} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='org-status'>Status</Label>
                  <Select
                    value={orgForm.status}
                    onValueChange={(value) => updateOrg('status', value)}
                  >
                    <SelectTrigger id='org-status' className='w-full'>
                      <SelectValue placeholder='Select status'>
                        {
                          ORGANIZATION_STATUS_OPTIONS.find(
                            (o) => o.value === orgForm.status,
                          )?.label
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ORGANIZATION_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={orgErrors.status} />
                </div>
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='org-address'>Address</Label>
                <Input
                  id='org-address'
                  type='text'
                  value={orgForm.address}
                  onChange={(e) => updateOrg('address', e.target.value)}
                  aria-invalid={!!orgErrors.address}
                />
                <FieldError message={orgErrors.address} />
              </div>
            </TabsContent>

            {/* Owner tab */}
            <TabsContent value='owner' className='mt-4 space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='user-first-name'>
                    First Name <span className='text-danger'>*</span>
                  </Label>
                  <Input
                    id='user-first-name'
                    type='text'
                    value={userForm.first_name}
                    onChange={(e) => updateUser('first_name', e.target.value)}
                    aria-invalid={!!userErrors.first_name}
                  />
                  <FieldError message={userErrors.first_name} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='user-last-name'>
                    Last Name <span className='text-danger'>*</span>
                  </Label>
                  <Input
                    id='user-last-name'
                    type='text'
                    value={userForm.last_name}
                    onChange={(e) => updateUser('last_name', e.target.value)}
                    aria-invalid={!!userErrors.last_name}
                  />
                  <FieldError message={userErrors.last_name} />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='user-email'>
                    Email <span className='text-danger'>*</span>
                  </Label>
                  <Input
                    id='user-email'
                    type='email'
                    value={userForm.email}
                    onChange={(e) => updateUser('email', e.target.value)}
                    aria-invalid={!!userErrors.email}
                  />
                  <FieldError message={userErrors.email} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='user-phone'>
                    Phone <span className='text-danger'>*</span>
                  </Label>
                  <BdPhoneInput
                    id='user-phone'
                    value={userForm.phone}
                    onChange={(value) => updateUser('phone', value)}
                  />
                  <FieldError message={userErrors.phone} />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='user-gender'>
                    Gender <span className='text-danger'>*</span>
                  </Label>
                  <Select
                    value={userForm.gender}
                    onValueChange={(value) => updateUser('gender', value)}
                  >
                    <SelectTrigger
                      id='user-gender'
                      className='w-full'
                      aria-invalid={!!userErrors.gender}
                    >
                      <SelectValue placeholder='Select gender'>
                        {
                          GENDER_OPTIONS.find(
                            (o) => o.value === userForm.gender,
                          )?.label
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={userErrors.gender} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='user-blood-group'>Blood Group</Label>
                  <Select
                    value={userForm.blood_group}
                    onValueChange={(value) => updateUser('blood_group', value)}
                  >
                    <SelectTrigger id='user-blood-group' className='w-full'>
                      <SelectValue placeholder='Select blood group'>
                        {
                          BLOOD_GROUP_OPTIONS.find(
                            (o) => o.value === userForm.blood_group,
                          )?.label
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {BLOOD_GROUP_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={userErrors.blood_group} />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='user-nid'>NID</Label>
                  <Input
                    id='user-nid'
                    type='text'
                    value={userForm.nid || ''}
                    onChange={(e) => updateUser('nid', e.target.value)}
                    aria-invalid={!!userErrors.nid}
                  />
                  <FieldError message={userErrors.nid} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='user-dob'>Date of Birth</Label>
                  <Input
                    id='user-dob'
                    type='date'
                    value={userForm.date_of_birth || ''}
                    onChange={(e) =>
                      updateUser('date_of_birth', e.target.value)
                    }
                    aria-invalid={!!userErrors.date_of_birth}
                  />
                  <FieldError message={userErrors.date_of_birth} />
                </div>
              </div>
            </TabsContent>

            {/* Social Links tab */}
            <TabsContent value='social' className='mt-4 space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='org-facebook'>Facebook</Label>
                  <Input
                    id='org-facebook'
                    type='url'
                    value={orgForm.facebook}
                    onChange={(e) => updateOrg('facebook', e.target.value)}
                    aria-invalid={!!orgErrors.facebook}
                  />
                  <FieldError message={orgErrors.facebook} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='org-twitter'>Twitter / X</Label>
                  <Input
                    id='org-twitter'
                    type='url'
                    value={orgForm.twitter}
                    onChange={(e) => updateOrg('twitter', e.target.value)}
                    aria-invalid={!!orgErrors.twitter}
                  />
                  <FieldError message={orgErrors.twitter} />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='org-linkedin'>LinkedIn</Label>
                  <Input
                    id='org-linkedin'
                    type='url'
                    value={orgForm.linkedin}
                    onChange={(e) => updateOrg('linkedin', e.target.value)}
                    aria-invalid={!!orgErrors.linkedin}
                  />
                  <FieldError message={orgErrors.linkedin} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='org-instagram'>Instagram</Label>
                  <Input
                    id='org-instagram'
                    type='url'
                    value={orgForm.instagram}
                    onChange={(e) => updateOrg('instagram', e.target.value)}
                    aria-invalid={!!orgErrors.instagram}
                  />
                  <FieldError message={orgErrors.instagram} />
                </div>
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='org-youtube'>YouTube</Label>
                <Input
                  id='org-youtube'
                  type='url'
                  value={orgForm.youtube}
                  onChange={(e) => updateOrg('youtube', e.target.value)}
                  aria-invalid={!!orgErrors.youtube}
                />
                <FieldError message={orgErrors.youtube} />
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {submitError && (
          <p className='text-danger text-center text-sm'>{submitError}</p>
        )}

        <DialogFooter className='mt-2'>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loading className='h-4 w-4 text-white!' />}
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateOrganizationDialog;
