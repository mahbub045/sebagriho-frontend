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
import { INITIAL_FORM } from '@/data/superAdmin/Organizations/OrganizationsData';
import { useUpdateOrganizationMutation } from '@/lib/services/endpoints/superAdmin/Organizations/OrganizationsApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  OrganizationDetail,
  OrganizationOwner,
  OrgErrors,
  TabKey,
  UpdateOrganizationDialogProps,
  UserErrors,
} from '@/types/superAdmin/Organizations/OrganizationsType';
import { BdPhoneInput } from '@/utils/bdPhoneInput';
import { getChangedFields } from '@/utils/commonFunctions';
import {
  BD_PHONE_REGEX,
  EMAIL_REGEX,
  stripCountryCode,
} from '@/utils/constants';
import { useState } from 'react';

const buildOrgForm = (
  organizationDetails: UpdateOrganizationDialogProps['organizationDetails'],
): OrganizationDetail => {
  if (!organizationDetails) return INITIAL_FORM.organization;

  const { organization } = organizationDetails;

  return {
    name: organization.name ?? '',
    organization_type: organization.organization_type ?? '',
    subdomain: organization.subdomain ?? '',
    description: organization.description ?? '',
    status: organization.status ?? '',
    phone: stripCountryCode(organization.phone),
    email: organization.email ?? '',
    website: organization.website ?? '',
    address: organization.address ?? '',
    facebook: organization.facebook ?? '',
    twitter: organization.twitter ?? '',
    linkedin: organization.linkedin ?? '',
    youtube: organization.youtube ?? '',
  };
};

const buildUserForm = (
  organizationDetails: UpdateOrganizationDialogProps['organizationDetails'],
): OrganizationOwner => {
  if (!organizationDetails) return { ...INITIAL_FORM.user };

  const { user } = organizationDetails;

  return {
    uid: user.uid ?? '',
    first_name: user.first_name ?? '',
    last_name: user.last_name ?? '',
    phone: stripCountryCode(user.phone),
    email: user.email ?? '',
    gender: user.gender ?? '',
    nid: user.nid ?? '',
    blood_group: user.blood_group ?? '',
    date_of_birth: user.date_of_birth ?? '',
  };
};

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

        if (msg) {
          orgErrors[key as keyof OrgErrors] = msg;
        }
      },
    );
  }

  if (dataObj.user && typeof dataObj.user === 'object') {
    Object.entries(dataObj.user as Record<string, unknown>).forEach(
      ([key, value]) => {
        const msg = flatten(value);

        if (msg) {
          userErrors[key as keyof UserErrors] = msg;
        }
      },
    );
  }

  return { orgErrors, userErrors };
};

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className='text-danger mt-1 text-xs'>{message}</p> : null;

const UpdateOrganizationDialogContent: React.FC<
  UpdateOrganizationDialogProps
> = ({ isOpen, onClose, organizationDetails }) => {
  const { dict } = useTranslation();
  const [updateOrganization, { isLoading }] = useUpdateOrganizationMutation();

  const [activeTab, setActiveTab] = useState<TabKey>('organization');

  // Keep the original values in state so they stay stable for this dialog instance.
  const [originalOrgForm] = useState<OrganizationDetail>(() =>
    buildOrgForm(organizationDetails),
  );

  const [originalUserForm] = useState<OrganizationOwner>(() =>
    buildUserForm(organizationDetails),
  );

  const [orgForm, setOrgForm] = useState<OrganizationDetail>(originalOrgForm);

  const [userForm, setUserForm] = useState<OrganizationOwner>(originalUserForm);

  const [orgErrors, setOrgErrors] = useState<OrgErrors>({});
  const [userErrors, setUserErrors] = useState<UserErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateOrg = (
    field: keyof OrganizationDetail,
    value: string | null | undefined,
  ) => {
    setOrgForm((prev) => ({
      ...prev,
      [field]: value ?? '',
    }));

    setOrgErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const updateUser = (
    field: keyof OrganizationOwner,
    value: string | null | undefined,
  ) => {
    setUserForm((prev) => ({
      ...prev,
      [field]: value ?? '',
    }));

    setUserErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validateOrganizationTab = () => {
    const errors: OrgErrors = {};

    if (!orgForm.name.trim()) {
      errors.name = dict.organizations.dialogs.validation.orgNameRequired;
    }

    if (!orgForm.organization_type) {
      errors.organization_type =
        dict.organizations.dialogs.validation.orgTypeRequired;
    }

    if (orgForm.email && !EMAIL_REGEX.test(orgForm.email)) {
      errors.email = dict.organizations.dialogs.validation.emailInvalid;
    }

    if (orgForm.phone && !BD_PHONE_REGEX.test(orgForm.phone)) {
      errors.phone = dict.organizations.dialogs.validation.phoneInvalid;
    }

    setOrgErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const validateOwnerTab = () => {
    const errors: UserErrors = {};

    if (!userForm.first_name.trim()) {
      errors.first_name = dict.organizations.dialogs.validation.firstNameRequired;
    }

    if (!userForm.last_name.trim()) {
      errors.last_name = dict.organizations.dialogs.validation.lastNameRequired;
    }

    if (!userForm.email.trim()) {
      errors.email = dict.organizations.dialogs.validation.emailRequired;
    } else if (!EMAIL_REGEX.test(userForm.email)) {
      errors.email = dict.organizations.dialogs.validation.emailInvalid;
    }

    if (!userForm.phone.trim()) {
      errors.phone = dict.organizations.dialogs.validation.phoneRequired;
    } else if (!BD_PHONE_REGEX.test(userForm.phone)) {
      errors.phone = dict.organizations.dialogs.validation.phoneInvalid;
    }

    if (!userForm.gender) {
      errors.gender = dict.organizations.dialogs.validation.genderRequired;
    }

    setUserErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const buildPayload = () => {
    const originalOrganization = {
      ...originalOrgForm,
      phone: originalOrgForm.phone ? `+88${originalOrgForm.phone}` : null,
    };

    const currentOrganization = {
      ...orgForm,
      phone: orgForm.phone ? `+88${orgForm.phone}` : null,
    };

    const originalUser = {
      first_name: originalUserForm.first_name,
      last_name: originalUserForm.last_name,
      phone: originalUserForm.phone ? `+88${originalUserForm.phone}` : null,
      email: originalUserForm.email,
      gender: originalUserForm.gender,
      nid: originalUserForm.nid || null,
      blood_group: originalUserForm.blood_group || null,
      date_of_birth: originalUserForm.date_of_birth || null,
    };

    const currentUser = {
      first_name: userForm.first_name,
      last_name: userForm.last_name,
      phone: userForm.phone ? `+88${userForm.phone}` : null,
      email: userForm.email,
      gender: userForm.gender,
      nid: userForm.nid || null,
      blood_group: userForm.blood_group || null,
      date_of_birth: userForm.date_of_birth || null,
    };

    const changedOrganization = getChangedFields(
      originalOrganization,
      currentOrganization,
    );

    const changedUser = getChangedFields(originalUser, currentUser);

    return {
      user: changedUser,
      organization: changedOrganization,
    };
  };

  // The button is enabled only when at least one value is different.
  const hasChanges = (() => {
    const payload = buildPayload();

    return (
      Object.keys(payload.organization).length > 0 ||
      Object.keys(payload.user).length > 0
    );
  })();

  const applyApiErrors = (error: unknown) => {
    const { orgErrors: apiOrgErrors, userErrors: apiUserErrors } =
      extractApiFieldErrors(error);

    setOrgErrors((prev) => ({
      ...prev,
      ...apiOrgErrors,
    }));

    setUserErrors((prev) => ({
      ...prev,
      ...apiUserErrors,
    }));

    if (
      Object.keys(apiOrgErrors).length === 0 &&
      Object.keys(apiUserErrors).length === 0
    ) {
      setSubmitError(dict.organizations.dialogs.validation.genericSubmitError);
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

    const payload = buildPayload();

    const hasOrganizationChanges = Object.keys(payload.organization).length > 0;

    const hasUserChanges = Object.keys(payload.user).length > 0;

    /**
     * Nothing changed.
     * No need to call the API.
     */
    if (!hasOrganizationChanges && !hasUserChanges) {
      onClose();
      return;
    }

    try {
      await updateOrganization({
        organizationUid: organizationDetails.uid,
        organizationData: payload,
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
            {dict.organizations.dialogs.updateOrganization.title}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground text-sm'>
            {dict.organizations.dialogs.updateOrganization.descriptionPrefix}{' '}
            {organizationDetails?.organization?.name ??
              dict.organizations.dialogs.updateOrganization.fallbackName}
            {dict.organizations.dialogs.updateOrganization.descriptionSuffix}
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[calc(90vh-2rem)] overflow-y-auto'>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TabKey)}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='organization' className='cursor-pointer'>
                {dict.organizations.dialogs.tabs.organization}
              </TabsTrigger>
              <TabsTrigger value='owner' className='cursor-pointer'>
                {dict.organizations.dialogs.tabs.owner}
              </TabsTrigger>
              <TabsTrigger value='social' className='cursor-pointer'>
                {dict.organizations.dialogs.tabs.socialLinks}
              </TabsTrigger>
            </TabsList>

            <div>
              {/* Organization tab */}
              <TabsContent value='organization' className='mt-4 space-y-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='org-name'>
                      {dict.organizations.dialogs.fields.organizationName}{' '}
                      <span className='text-danger'>*</span>
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
                      {dict.organizations.dialogs.fields.organizationType}{' '}
                      <span className='text-danger'>*</span>
                    </Label>
                    <Select
                      items={ORGANIZATION_TYPE_OPTIONS}
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
                        <SelectValue
                          placeholder={
                            dict.organizations.dialogs.placeholders.selectType
                          }
                        />
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
                  <Label htmlFor='org-subdomain'>
                    {dict.organizations.dialogs.fields.subdomain}{' '}
                    <span className='text-danger'>*</span>
                  </Label>
                  <div className='gap-1d flex items-center'>
                    <Input
                      id='org-subdomain'
                      type='text'
                      placeholder={
                        dict.organizations.dialogs.placeholders.subdomain
                      }
                      value={orgForm.subdomain}
                      onChange={(e) =>
                        updateOrg('subdomain', e.target.value.toLowerCase())
                      }
                      aria-invalid={!!orgErrors.subdomain}
                      className='rounded-r-none!'
                    />
                    <span className='bg-primary flex h-10 shrink-0 items-center rounded-r-md px-3 text-sm text-white'>
                      {process.env.NEXT_PUBLIC_COOKIE_DOMAIN}
                    </span>
                  </div>
                  <FieldError message={orgErrors.subdomain} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='org-description'>
                    {dict.organizations.dialogs.fields.description}
                  </Label>
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
                    <Label htmlFor='org-email'>
                      {dict.organizations.dialogs.fields.email}
                    </Label>
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
                    <Label htmlFor='org-phone'>
                      {dict.organizations.dialogs.fields.phone}
                    </Label>
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
                    <Label htmlFor='org-website'>
                      {dict.organizations.dialogs.fields.website}
                    </Label>
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
                    <Label htmlFor='org-status'>
                      {dict.organizations.dialogs.fields.status}
                    </Label>
                    <Select
                      items={ORGANIZATION_STATUS_OPTIONS}
                      value={orgForm.status}
                      onValueChange={(value) => updateOrg('status', value)}
                    >
                      <SelectTrigger id='org-status' className='w-full'>
                        <SelectValue
                          placeholder={
                            dict.organizations.dialogs.placeholders.selectStatus
                          }
                        />
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
                  <Label htmlFor='org-address'>
                    {dict.organizations.dialogs.fields.address}
                  </Label>
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
                      {dict.organizations.dialogs.fields.firstName}{' '}
                      <span className='text-danger'>*</span>
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
                      {dict.organizations.dialogs.fields.lastName}{' '}
                      <span className='text-danger'>*</span>
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
                      {dict.organizations.dialogs.fields.email}{' '}
                      <span className='text-danger'>*</span>
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
                      {dict.organizations.dialogs.fields.phone}{' '}
                      <span className='text-danger'>*</span>
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
                      {dict.organizations.dialogs.fields.gender}{' '}
                      <span className='text-danger'>*</span>
                    </Label>
                    <Select
                      items={GENDER_OPTIONS}
                      value={userForm.gender}
                      onValueChange={(value) => updateUser('gender', value)}
                    >
                      <SelectTrigger
                        id='user-gender'
                        className='w-full'
                        aria-invalid={!!userErrors.gender}
                      >
                        <SelectValue
                          placeholder={
                            dict.organizations.dialogs.placeholders.selectGender
                          }
                        />
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
                    <Label htmlFor='user-blood-group'>
                      {dict.organizations.dialogs.fields.bloodGroup}
                    </Label>
                    <Select
                      items={BLOOD_GROUP_OPTIONS}
                      value={userForm.blood_group}
                      onValueChange={(value) =>
                        updateUser('blood_group', value)
                      }
                    >
                      <SelectTrigger id='user-blood-group' className='w-full'>
                        <SelectValue
                          placeholder={
                            dict.organizations.dialogs.placeholders
                              .selectBloodGroup
                          }
                        />
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
                    <Label htmlFor='user-nid'>
                      {dict.organizations.dialogs.fields.nid}
                    </Label>
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
                    <Label htmlFor='user-dob'>
                      {dict.organizations.dialogs.fields.dateOfBirth}
                    </Label>
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
                    <Label htmlFor='org-facebook'>
                      {dict.organizations.dialogs.fields.facebook}
                    </Label>
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
                    <Label htmlFor='org-twitter'>
                      {dict.organizations.dialogs.fields.twitter}
                    </Label>
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
                    <Label htmlFor='org-linkedin'>
                      {dict.organizations.dialogs.fields.linkedin}
                    </Label>
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
                    <Label htmlFor='org-youtube'>
                      {dict.organizations.dialogs.fields.youtube}
                    </Label>
                    <Input
                      id='org-youtube'
                      type='url'
                      value={orgForm.youtube}
                      onChange={(e) => updateOrg('youtube', e.target.value)}
                      aria-invalid={!!orgErrors.youtube}
                    />
                    <FieldError message={orgErrors.youtube} />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {submitError && (
            <p className='text-danger text-center text-sm'>{submitError}</p>
          )}

          <DialogFooter className='mt-2'>
            <Button variant='outline' onClick={onClose} disabled={isLoading}>
              {dict.common.cancel}
            </Button>

            <Button onClick={handleSubmit} disabled={isLoading || !hasChanges}>
              {isLoading && <Loading className='h-4 w-4 text-white!' />}
              {isLoading
                ? dict.organizations.dialogs.updateOrganization.saving
                : dict.organizations.dialogs.updateOrganization.saveChanges}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UpdateOrganizationDialog: React.FC<UpdateOrganizationDialogProps> = (
  props,
) => {
  // Remount the form whenever the dialog is opened so its initial state is fresh.
  const key = props.isOpen
    ? `open-${props.organizationDetails?.uid ?? 'organization'}`
    : 'closed';

  return <UpdateOrganizationDialogContent key={key} {...props} />;
};

export default UpdateOrganizationDialog;
