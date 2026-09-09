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
import {
  INITIAL_FORM,
  TAB_ORDER,
} from '@/data/superAdmin/Organizations/OrganizationsData';
import { useAddOrganizationMutation } from '@/lib/services/endpoints/superAdmin/Organizations/OrganizationsApi';
import {
  AddOrganizationDialogProps,
  OrgErrors,
  TabKey,
  UserErrors,
} from '@/types/superAdmin/Organizations/OrganizationsType';
import { BdPhoneInput } from '@/utils/bdPhoneInput';
import {
  addCountryCode,
  BD_PHONE_REGEX,
  EMAIL_REGEX,
  SUBDOMAIN_REGEX,
} from '@/utils/constants';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';

// Extract field-level messages from a DRF-style error response:
// { organization: { name: [...] }, user: { email: [...] } } or flat { email: [...] }
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

  // Fallback: some APIs return flat, non-nested field errors
  Object.entries(dataObj).forEach(([key, value]) => {
    if (key === 'organization' || key === 'user') return;
    const msg = flatten(value);
    if (!msg) return;
    if (key in INITIAL_FORM.organization) {
      orgErrors[key as keyof OrgErrors] = msg;
    } else if (key in INITIAL_FORM.user) {
      userErrors[key as keyof UserErrors] = msg;
    }
  });

  return { orgErrors, userErrors };
};

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className='text-danger mt-1 text-xs'>{message}</p> : null;

const AddOrganizationDialog: React.FC<AddOrganizationDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [addOrganization, { isLoading }] = useAddOrganizationMutation();
  const [form, setForm] = useState(INITIAL_FORM);
  const [activeTab, setActiveTab] = useState<TabKey>('organization');
  const [orgErrors, setOrgErrors] = useState<OrgErrors>({});
  const [userErrors, setUserErrors] = useState<UserErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateUser = (field: keyof typeof form.user, value: string | null) => {
    setForm((prev) => ({
      ...prev,
      user: { ...prev.user, [field]: value ?? '' },
    }));
    setUserErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateOrg = (
    field: keyof typeof form.organization,
    value: string | null,
  ) => {
    setForm((prev) => ({
      ...prev,
      organization: { ...prev.organization, [field]: value },
    }));
    setOrgErrors((prev: OrgErrors) => ({ ...prev, [field]: undefined }));
  };

  const resetAndClose = () => {
    setForm(INITIAL_FORM);
    setActiveTab('organization');
    setOrgErrors({});
    setUserErrors({});
    setSubmitError(null);
    onClose();
  };

  const validateOrganizationTab = () => {
    const errors: OrgErrors = {};
    if (!form.organization.name.trim()) {
      errors.name = 'Organization name is required.';
    }
    if (!form.organization.organization_type) {
      errors.organization_type = 'Organization type is required.';
    }
    if (!form.organization.subdomain.trim()) {
      errors.subdomain = 'Subdomain is required.';
    } else if (!SUBDOMAIN_REGEX.test(form.organization.subdomain)) {
      errors.subdomain =
        'Use lowercase letters, numbers, and hyphens only (no leading/trailing hyphen).';
    }
    if (form.organization.email && !EMAIL_REGEX.test(form.organization.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (
      form.organization.phone &&
      !BD_PHONE_REGEX.test(form.organization.phone)
    ) {
      errors.phone = 'Enter a valid 11-digit BD phone number.';
    }
    setOrgErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOwnerTab = () => {
    const errors: UserErrors = {};
    if (!form.user.first_name.trim()) {
      errors.first_name = 'First name is required.';
    }
    if (!form.user.last_name.trim()) {
      errors.last_name = 'Last name is required.';
    }
    if (!form.user.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!EMAIL_REGEX.test(form.user.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!form.user.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!BD_PHONE_REGEX.test(form.user.phone)) {
      errors.phone = 'Enter a valid 11-digit BD phone number.';
    }
    if (!form.user.gender) {
      errors.gender = 'Gender is required.';
    }
    setUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToTab = (tab: TabKey) => {
    setActiveTab(tab);
  };

  const applyApiErrors = (error: unknown) => {
    const { orgErrors: apiOrgErrors, userErrors: apiUserErrors } =
      extractApiFieldErrors(error);

    setOrgErrors((prev: OrgErrors) => ({ ...prev, ...apiOrgErrors }));
    setUserErrors((prev: UserErrors) => ({ ...prev, ...apiUserErrors }));

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

  const buildPayload = () => ({
    organization: {
      name: form.organization.name,
      organization_type: form.organization.organization_type,
      subdomain: form.organization.subdomain,
      description: form.organization.description,
      email: form.organization.email,
      phone: addCountryCode(form.organization.phone),
      website: form.organization.website,
      status: form.organization.status,
      address: form.organization.address,
    },
    user: {
      first_name: form.user.first_name,
      last_name: form.user.last_name,
      email: form.user.email,
      phone: addCountryCode(form.user.phone),
      gender: form.user.gender,
      blood_group: form.user.blood_group,
      date_of_birth: form.user.date_of_birth ? form.user.date_of_birth : null,
      nid: form.user.nid ? form.user.nid : null,
    },
  });

  const handleNext = async () => {
    setSubmitError(null);

    if (activeTab === 'organization') {
      const isValid = validateOrganizationTab();
      if (!isValid) return;

      try {
        await addOrganization(buildPayload()).unwrap();
        setActiveTab('owner');
      } catch (error) {
        applyApiErrors(error);
        console.error('Organization field validation failed:', error);
      }
      return;
    }

    if (activeTab === 'owner') {
      const isValid = validateOwnerTab();
      if (!isValid) return;
      try {
        await addOrganization(buildPayload()).unwrap();
        resetAndClose();
      } catch (error) {
        applyApiErrors(error);
        console.error('Owner field validation failed:', error);
      }
      return;
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(TAB_ORDER[currentIndex - 1]);
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
      await addOrganization(buildPayload()).unwrap();
      resetAndClose();
    } catch (error) {
      applyApiErrors(error);
      console.error('Failed to add organization:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className='max-h-[90vh] overflow-hidden p-4 sm:max-w-185'>
        <DialogHeader className='text-lg font-semibold'>
          <DialogTitle className='text-primary -mb-3 text-2xl'>
            Add Organization
          </DialogTitle>
          <DialogDescription className='text-muted-foreground text-sm'>
            Add a new organization to the system.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => goToTab(value as TabKey)}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='organization' className='cursor-pointer'>
              Organization
            </TabsTrigger>
            <TabsTrigger value='owner' className='cursor-pointer'>
              Owner
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
                    placeholder='e.g. ABC Chamber of Commerce'
                    value={form.organization.name}
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
                    items={ORGANIZATION_TYPE_OPTIONS}
                    value={form.organization.organization_type}
                    onValueChange={(value) =>
                      updateOrg('organization_type', value)
                    }
                  >
                    <SelectTrigger
                      id='org-type'
                      className='w-full'
                      aria-invalid={!!orgErrors.organization_type}
                    >
                      <SelectValue placeholder='Select type' />
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
                  Subdomain <span className='text-danger'>*</span>
                </Label>
                <div className='gap-1d flex items-center'>
                  <Input
                    id='org-subdomain'
                    type='text'
                    placeholder='e.g. abc-chamber'
                    value={form.organization.subdomain}
                    onChange={(e) =>
                      updateOrg('subdomain', e.target.value.toLowerCase())
                    }
                    aria-invalid={!!orgErrors.subdomain}
                    className='rounded-r-none!'
                  />
                  <span className='bg-primary flex h-10 shrink-0 items-center rounded-r-md px-3 text-sm text-white'>
                    .sebagriho.com
                  </span>
                </div>
                <FieldError message={orgErrors.subdomain} />
              </div>

              <div className='space-y-1.5'>
                <Label htmlFor='org-description'>Description</Label>
                <Textarea
                  id='org-description'
                  placeholder='Brief description of the organization'
                  className='field-sizing-fixed'
                  value={form.organization.description}
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
                    placeholder='info@organization.com'
                    value={form.organization.email}
                    onChange={(e) => updateOrg('email', e.target.value)}
                    aria-invalid={!!orgErrors.email}
                  />
                  <FieldError message={orgErrors.email} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='org-phone'>Phone</Label>
                  <BdPhoneInput
                    id='org-phone'
                    value={form.organization.phone}
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
                    placeholder='https://organization.com'
                    value={form.organization.website}
                    onChange={(e) => updateOrg('website', e.target.value)}
                    aria-invalid={!!orgErrors.website}
                  />
                  <FieldError message={orgErrors.website} />
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='org-status'>Status</Label>
                  <Select
                    items={ORGANIZATION_STATUS_OPTIONS}
                    value={form.organization.status}
                    onValueChange={(value) => updateOrg('status', value)}
                  >
                    <SelectTrigger id='org-status' className='w-full'>
                      <SelectValue placeholder='Select status' />
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
                  placeholder='e.g. Dhaka, Bangladesh'
                  value={form.organization.address}
                  onChange={(e) => updateOrg('address', e.target.value)}
                  aria-invalid={!!orgErrors.address}
                />
                <FieldError message={orgErrors.address} />
              </div>
            </TabsContent>

            {/* owner / User tab */}
            <TabsContent value='owner' className='mt-4 space-y-4'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='user-first-name'>
                    First Name <span className='text-danger'>*</span>
                  </Label>
                  <Input
                    id='user-first-name'
                    type='text'
                    placeholder='First name'
                    value={form.user.first_name}
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
                    placeholder='Last name'
                    value={form.user.last_name}
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
                    placeholder='name@example.com'
                    value={form.user.email}
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
                    value={form.user.phone}
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
                    items={GENDER_OPTIONS}
                    value={form.user.gender}
                    onValueChange={(value) => updateUser('gender', value)}
                  >
                    <SelectTrigger
                      id='user-gender'
                      className='w-full'
                      aria-invalid={!!userErrors.gender}
                    >
                      <SelectValue placeholder='Select gender' />
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
                    items={BLOOD_GROUP_OPTIONS}
                    value={form.user.blood_group}
                    onValueChange={(value) => updateUser('blood_group', value)}
                  >
                    <SelectTrigger id='user-blood-group' className='w-full'>
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
                  <FieldError message={userErrors.blood_group} />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='user-nid'>NID</Label>
                  <Input
                    id='user-nid'
                    type='text'
                    placeholder='National ID number'
                    value={form.user.nid}
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
                    value={form.user.date_of_birth}
                    onChange={(e) =>
                      updateUser('date_of_birth', e.target.value)
                    }
                    aria-invalid={!!userErrors.date_of_birth}
                  />
                  <FieldError message={userErrors.date_of_birth} />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {submitError && (
          <p className='text-danger text-center text-sm'>{submitError}</p>
        )}

        <DialogFooter className='mt-2 flex-row items-center sm:justify-between'>
          <Button
            variant='warning'
            onClick={resetAndClose}
            disabled={isLoading}
          >
            <X className='h-4 w-4' />
            Cancel
          </Button>

          <div className='flex items-center gap-2'>
            {activeTab !== 'organization' && (
              <Button
                type='button'
                variant='outline'
                onClick={handleBack}
                disabled={isLoading}
              >
                <ChevronLeft className='h-4 w-4' />
                Back
              </Button>
            )}

            {activeTab !== 'owner' ? (
              <Button onClick={handleNext} disabled={isLoading}>
                {isLoading && <Loading className='h-4 w-4 text-white!' />}
                {isLoading ? 'Checking...' : 'Next'}{' '}
                <ChevronRight className='h-4 w-4' />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading && <Loading className='h-4 w-4 text-white!' />}
                {isLoading ? 'Adding...' : 'Add Organization'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrganizationDialog;
