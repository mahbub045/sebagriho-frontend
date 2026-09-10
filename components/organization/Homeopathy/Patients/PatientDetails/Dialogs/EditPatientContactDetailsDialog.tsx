import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEditPatientMutation } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';
import {
  EditPatientContactDetailsDailogProps,
  FieldErrorMap,
} from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { BdPhoneInput } from '@/utils/bdPhoneInput';
import { addCountryCode, stripCountryCode } from '@/utils/constants';
import { useState } from 'react';
import { toast } from 'sonner';

const EditPatientContactDetailsDialog: React.FC<
  EditPatientContactDetailsDailogProps
> = ({ isOpen, onClose, patientInfo }) => {
  const [editPatient, { isLoading, error }] = useEditPatientMutation();

  const [formData, setFormData] = useState({
    phone: stripCountryCode(patientInfo.user.phone) ?? '',
    relative_phone: stripCountryCode(patientInfo.relative_phone) ?? '',
    address: patientInfo.address ?? '',
    email: patientInfo.user.email ?? '',
  });

  // Normalize whatever shape the API sends back into { field: "message" }
  const fieldErrors: FieldErrorMap =
    (error as { data?: FieldErrorMap })?.data ?? {};

  const getFieldError = (field: string) => {
    const path = field.split('.');
    let value: unknown = fieldErrors;

    for (const key of path) {
      if (value && typeof value === 'object' && key in (value as object)) {
        value = (value as Record<string, unknown>)[key];
      } else {
        value = undefined;
        break;
      }
    }

    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : (value as string);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const initial = {
      phone: stripCountryCode(patientInfo.user.phone) ?? '',
      relative_phone: stripCountryCode(patientInfo.relative_phone) ?? '',
      address: patientInfo.address ?? '',
      email: patientInfo.user.email ?? '',
    };

    const payload = new FormData();
    let hasChanges = false;

    if (formData.phone !== initial.phone) {
      payload.append(
        'user.phone',
        String(addCountryCode(formData.phone) ?? ''),
      );
      hasChanges = true;
    }

    if (formData.relative_phone !== initial.relative_phone) {
      payload.append(
        'relative_phone',
        String(addCountryCode(formData.relative_phone) ?? null),
      );
      hasChanges = true;
    }

    if (formData.address !== initial.address) {
      payload.append('address', formData.address);
      hasChanges = true;
    }

    if (formData.email !== initial.email) {
      payload.append('user.email', formData.email);
      hasChanges = true;
    }

    if (!hasChanges) {
      onClose();
      return;
    }

    try {
      await editPatient({
        patientUid: patientInfo.uid,
        payload,
      }).unwrap();
      onClose();
      toast.success('Patient edited successfully');
    } catch {
      toast.error('Failed to edit patient. Please check the form.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            Edit Patient Contact Details
          </DialogTitle>
          <DialogDescription>
            Update the patient&apos;s contact information.
          </DialogDescription>
        </DialogHeader>
        <form
          key={patientInfo.uid}
          onSubmit={handleSubmit}
          className='flex flex-col gap-5 p-1'
        >
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='phone'>Phone</Label>
            <BdPhoneInput
              id='phone'
              value={formData.phone}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, phone: value }))
              }
            />
            {getFieldError('user.phone') && (
              <p className='text-destructive text-xs'>
                {getFieldError('user.phone')}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='relative_phone'>Relative Phone</Label>
            <BdPhoneInput
              id='relative_phone'
              value={formData.relative_phone}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, relative_phone: value }))
              }
            />
            {getFieldError('relative_phone') && (
              <p className='text-destructive text-xs'>
                {getFieldError('relative_phone')}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
            />
            {getFieldError('user.email') && (
              <p className='text-destructive text-xs'>
                {getFieldError('user.email')}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='address'>Address</Label>
            <Input
              type='text'
              id='address'
              name='address'
              value={formData.address}
              onChange={handleChange}
            />
            {getFieldError('address') && (
              <p className='text-destructive text-xs'>
                {getFieldError('address')}
              </p>
            )}
          </div>
          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loading className='h-4 w-4 text-white!' />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientContactDetailsDialog;
