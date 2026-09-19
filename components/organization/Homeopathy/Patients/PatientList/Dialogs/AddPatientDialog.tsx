'use client';

import { useState } from 'react';

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
import { Textarea } from '@/components/ui/textarea';

import {
  BLOOD_GROUP_OPTIONS,
  GENDER_OPTIONS,
  MIASM_TYPE_OPTIONS,
} from '@/data/common/ChoiceFields';

import { useAddPatientMutation } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';

import {
  AddPatientDialogProps,
  AddPatientFormValues,
  FieldErrorMap,
  FieldErrors,
  MiasmType,
  PatientGender,
} from '@/types/Organization/Homeopathy/Patients/PatientsType';

import { DEFAULT_VALUES } from '@/data/Organization/Homeopathy/PatientsData';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { BdPhoneInput } from '@/utils/bdPhoneInput';
import { addCountryCode } from '@/utils/constants';

const getFieldError = (
  errors: FieldErrorMap | undefined,
  field: string,
): string | undefined => {
  if (!errors) return undefined;

  const value = errors[field];

  if (!value) return undefined;

  return Array.isArray(value) ? value[0] : value;
};

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className='text-danger text-xs'>{message}</p> : null;

const AddPatientDialog = ({ isOpen, onClose }: AddPatientDialogProps) => {
  const { dict } = useTranslation();
  const [addPatient, { isLoading }] = useAddPatientMutation();

  const [formValues, setFormValues] =
    useState<AddPatientFormValues>(DEFAULT_VALUES);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiErrors, setApiErrors] = useState<FieldErrorMap>();
  const [nonFieldError, setNonFieldError] = useState<string>();

  const updateField = <K extends keyof AddPatientFormValues>(
    field: K,
    value: AddPatientFormValues[K],
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      if (!prev[field]) return prev;

      const next = { ...prev };
      delete next[field];

      return next;
    });

    setApiErrors((prev) => {
      if (!prev?.[field]) return prev;

      const next = { ...prev };
      delete next[field];

      return next;
    });

    setNonFieldError(undefined);
  };

  const resetForm = () => {
    setFormValues(DEFAULT_VALUES);
    setErrors({});
    setApiErrors(undefined);
    setNonFieldError(undefined);
  };

  const handleClose = () => {
    if (isLoading) return;

    resetForm();
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {};

    if (!formValues.first_name.trim()) {
      newErrors.first_name = dict.patients.dialogs.addPatient.errors.firstNameRequired;
    }

    if (!formValues.last_name.trim()) {
      newErrors.last_name = dict.patients.dialogs.addPatient.errors.lastNameRequired;
    }

    if (!formValues.phone.trim()) {
      newErrors.phone = dict.patients.dialogs.addPatient.errors.phoneRequired;
    }

    if (
      formValues.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)
    ) {
      newErrors.email = dict.patients.dialogs.addPatient.errors.invalidEmail;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setApiErrors(undefined);
    setNonFieldError(undefined);

    if (!validateForm()) return;

    const payload = {
      user: {
        first_name: formValues.first_name.trim(),
        last_name: formValues.last_name.trim(),
        phone: formValues.phone.trim()
          ? addCountryCode(formValues.phone.trim())
          : null,
        email: formValues.email.trim() || null,
        gender: formValues.gender || null,

        blood_group: formValues.blood_group || null,
      },

      old_serial_number: formValues.old_serial_number
        ? Number(formValues.old_serial_number)
        : null,

      address: formValues.address.trim() || null,

      age: formValues.age ? Number(formValues.age) : null,

      miasm_type: formValues.miasm_type || null,

      case_history: formValues.case_history.trim() || null,

      habits: formValues.habits.trim() || null,
    };

    try {
      await addPatient(payload).unwrap();

      resetForm();
      onClose();
    } catch (err: unknown) {
      const data = (
        err as {
          data?: unknown;
        }
      )?.data;

      if (!data || typeof data !== 'object') {
        setNonFieldError(dict.patients.dialogs.addPatient.errors.genericError);
        return;
      }

      const responseData = data as Record<string, unknown>;

      const flattened: FieldErrorMap = {};

      Object.entries(responseData).forEach(([key, value]) => {
        if (
          typeof value === 'string' ||
          (Array.isArray(value) &&
            value.every((item) => typeof item === 'string'))
        ) {
          flattened[key] = value as string | string[];
        }
      });

      if (
        responseData.user &&
        typeof responseData.user === 'object' &&
        !Array.isArray(responseData.user)
      ) {
        Object.entries(responseData.user as Record<string, unknown>).forEach(
          ([key, value]) => {
            if (
              typeof value === 'string' ||
              (Array.isArray(value) &&
                value.every((item) => typeof item === 'string'))
            ) {
              flattened[key] = value as string | string[];
            }
          },
        );
      }

      const nonFieldErrors = getFieldError(flattened, 'non_field_errors');

      const detail = getFieldError(flattened, 'detail');

      if (nonFieldErrors) {
        setNonFieldError(nonFieldErrors);
        delete flattened.non_field_errors;
      } else if (detail) {
        setNonFieldError(detail);
        delete flattened.detail;
      } else if (Object.keys(flattened).length === 0) {
        setNonFieldError(dict.patients.dialogs.addPatient.errors.genericError);
      }

      setApiErrors(flattened);
    }
  };

  const renderError = (field: keyof AddPatientFormValues) =>
    errors[field] ?? getFieldError(apiErrors, field);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-185'>
        <DialogHeader className='text-lg font-semibold'>
          <DialogTitle className='text-primary -mb-3 text-2xl'>
            {dict.patients.dialogs.addPatient.title}
          </DialogTitle>

          <DialogDescription className='text-muted-foreground text-sm'>
            {dict.patients.dialogs.addPatient.description}
          </DialogDescription>
        </DialogHeader>

        <form
          id='add-patient-form'
          onSubmit={handleSubmit}
          className='flex flex-col gap-5'
        >
          {nonFieldError && (
            <div className='text-danger border-danger/30 bg-danger/10 rounded-md border px-3 py-2 text-sm'>
              {nonFieldError}
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h3 className='mb-3 text-sm font-semibold'>
              {dict.patients.dialogs.addPatient.personalInformationSection}
            </h3>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              {/* First Name */}
              <div className='space-y-1.5'>
                <Label htmlFor='first_name'>
                  {dict.patients.dialogs.addPatient.firstName}{' '}
                  <span className='text-danger'>*</span>
                </Label>

                <Input
                  id='first_name'
                  type='text'
                  placeholder={dict.patients.dialogs.addPatient.firstNamePlaceholder}
                  value={formValues.first_name}
                  onChange={(e) => updateField('first_name', e.target.value)}
                  aria-invalid={!!renderError('first_name')}
                />

                <FieldError message={renderError('first_name')} />
              </div>

              {/* Last Name */}
              <div className='space-y-1.5'>
                <Label htmlFor='last_name'>
                  {dict.patients.dialogs.addPatient.lastName}{' '}
                  <span className='text-danger'>*</span>
                </Label>

                <Input
                  id='last_name'
                  type='text'
                  placeholder={dict.patients.dialogs.addPatient.lastNamePlaceholder}
                  value={formValues.last_name}
                  onChange={(e) => updateField('last_name', e.target.value)}
                  aria-invalid={!!renderError('last_name')}
                />

                <FieldError message={renderError('last_name')} />
              </div>

              {/* Phone */}
              <div className='space-y-1.5'>
                <Label htmlFor='phone'>
                  {dict.patients.dialogs.addPatient.phone}{' '}
                  <span className='text-danger'>*</span>
                </Label>

                <BdPhoneInput
                  id='phone'
                  value={formValues.phone}
                  onChange={(value) => updateField('phone', value)}
                  aria-invalid={!!renderError('phone')}
                />

                <FieldError message={renderError('phone')} />
              </div>

              {/* Email */}
              <div className='space-y-1.5'>
                <Label htmlFor='email'>
                  {dict.patients.dialogs.addPatient.email}
                </Label>

                <Input
                  id='email'
                  type='email'
                  placeholder={dict.patients.dialogs.addPatient.emailPlaceholder}
                  value={formValues.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  aria-invalid={!!renderError('email')}
                />

                <FieldError message={renderError('email')} />
              </div>

              {/* Gender */}
              <div className='space-y-1.5'>
                <Label htmlFor='gender'>
                  {dict.patients.dialogs.addPatient.gender}
                </Label>

                <Select
                  items={GENDER_OPTIONS}
                  value={formValues.gender}
                  onValueChange={(value) =>
                    updateField('gender', value as PatientGender)
                  }
                >
                  <SelectTrigger
                    id='gender'
                    className='w-full'
                    aria-invalid={!!renderError('gender')}
                  >
                    <SelectValue
                      placeholder={dict.patients.dialogs.addPatient.genderPlaceholder}
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

                <FieldError message={renderError('gender')} />
              </div>

              {/* Age */}
              <div className='space-y-1.5'>
                <Label htmlFor='age'>{dict.patients.dialogs.addPatient.age}</Label>

                <Input
                  id='age'
                  type='number'
                  min={0}
                  placeholder={dict.patients.dialogs.addPatient.agePlaceholder}
                  value={formValues.age}
                  onChange={(e) => updateField('age', e.target.value)}
                  aria-invalid={!!renderError('age')}
                />

                <FieldError message={renderError('age')} />
              </div>

              {/* Old Serial Number */}
              <div className='space-y-1.5'>
                <Label htmlFor='old_serial_number'>
                  {dict.patients.dialogs.addPatient.oldSerialNumber}
                </Label>

                <Input
                  id='old_serial_number'
                  type='number'
                  min={0}
                  placeholder={
                    dict.patients.dialogs.addPatient.oldSerialNumberPlaceholder
                  }
                  value={formValues.old_serial_number}
                  onChange={(e) =>
                    updateField('old_serial_number', e.target.value)
                  }
                  aria-invalid={!!renderError('old_serial_number')}
                />

                <FieldError message={renderError('old_serial_number')} />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className='mb-3 text-sm font-semibold'>
              {dict.patients.dialogs.addPatient.contactInformationSection}
            </h3>

            <div className='grid grid-cols-1'>
              {/* Relative Phone */}

              {/* Address */}
              <div className='space-y-1.5 sm:col-span-1'>
                <Label htmlFor='address'>
                  {dict.patients.dialogs.addPatient.address}
                </Label>

                <Input
                  id='address'
                  type='text'
                  placeholder={dict.patients.dialogs.addPatient.addressPlaceholder}
                  value={formValues.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  aria-invalid={!!renderError('address')}
                />

                <FieldError message={renderError('address')} />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h3 className='mb-3 text-sm font-semibold'>
              {dict.patients.dialogs.addPatient.medicalInformationSection}
            </h3>

            <div className='grid grid-cols-1 gap-4'>
              {/* Miasm Type */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-1.5'>
                  <Label htmlFor='blood_group'>
                    {dict.patients.dialogs.addPatient.bloodGroup}
                  </Label>

                  <Select
                    items={BLOOD_GROUP_OPTIONS}
                    value={formValues.blood_group}
                    onValueChange={(value) =>
                      updateField('blood_group', value as string)
                    }
                  >
                    <SelectTrigger
                      id='blood_group'
                      className='w-full'
                      aria-invalid={!!renderError('blood_group')}
                    >
                      <SelectValue
                        placeholder={
                          dict.patients.dialogs.addPatient.bloodGroupPlaceholder
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

                  <FieldError message={renderError('blood_group')} />
                </div>
                <div className='space-y-1.5'>
                  <Label htmlFor='miasm_type'>
                    {dict.patients.dialogs.addPatient.miasmType}
                  </Label>

                  <Select
                    items={MIASM_TYPE_OPTIONS}
                    value={formValues.miasm_type}
                    onValueChange={(value) =>
                      updateField('miasm_type', value as MiasmType)
                    }
                  >
                    <SelectTrigger
                      id='miasm_type'
                      className='w-full'
                      aria-invalid={!!renderError('miasm_type')}
                    >
                      <SelectValue
                        placeholder={
                          dict.patients.dialogs.addPatient.miasmTypePlaceholder
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {MIASM_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FieldError message={renderError('miasm_type')} />
                </div>
              </div>

              {/* Case History */}
              <div className='space-y-1.5'>
                <Label htmlFor='case_history'>
                  {dict.patients.dialogs.addPatient.caseHistory}
                </Label>

                <Textarea
                  id='case_history'
                  placeholder={dict.patients.dialogs.addPatient.caseHistoryPlaceholder}
                  rows={4}
                  value={formValues.case_history}
                  onChange={(e) => updateField('case_history', e.target.value)}
                  aria-invalid={!!renderError('case_history')}
                />

                <FieldError message={renderError('case_history')} />
              </div>

              {/* Habits */}
              <div className='space-y-1.5'>
                <Label htmlFor='habits'>
                  {dict.patients.dialogs.addPatient.habits}
                </Label>

                <Textarea
                  id='habits'
                  placeholder={dict.patients.dialogs.addPatient.habitsPlaceholder}
                  rows={3}
                  value={formValues.habits}
                  onChange={(e) => updateField('habits', e.target.value)}
                  aria-invalid={!!renderError('habits')}
                />

                <FieldError message={renderError('habits')} />
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className='mt-2 flex-row items-center sm:justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={isLoading}
          >
            {dict.common.cancel}
          </Button>

          <Button type='submit' form='add-patient-form' disabled={isLoading}>
            {isLoading && <Loading className='h-4 w-4 text-white!' />}

            {isLoading
              ? dict.patients.dialogs.addPatient.adding
              : dict.patients.dialogs.addPatient.title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatientDialog;
