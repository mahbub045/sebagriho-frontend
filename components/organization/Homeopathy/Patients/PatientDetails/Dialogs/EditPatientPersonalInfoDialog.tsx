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
import { useEditPatientMutation } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';
import {
  EditPatientPersonalInfoDailogProps,
  FieldErrorMap,
} from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { useState } from 'react';
import { toast } from 'sonner';

const EditPatientPersonalInfoDialog: React.FC<
  EditPatientPersonalInfoDailogProps
> = ({ isOpen, onClose, patientInfo }) => {
  const [editPatient, { isLoading, isError, error }] = useEditPatientMutation();

  const [formData, setFormData] = useState({
    age: patientInfo.age !== null ? String(patientInfo.age) : '',
    gender: patientInfo.user.gender ?? '',
    blood_group: patientInfo.user.blood_group ?? '',
  });

  // Normalize whatever shape the API sends back into { field: "message" }
  const fieldErrors: FieldErrorMap =
    (error as { data?: FieldErrorMap })?.data ?? {};

  const getFieldError = (field: string) => {
    const value = fieldErrors[field];
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('age', formData.age);
    payload.append('user.gender', formData.gender);
    payload.append('user.blood_group', formData.blood_group);
    try {
      await editPatient({
        patientUid: patientInfo.uid,
        payload,
      }).unwrap();
      onClose();
      toast.success('Patient editd successfully');
    } catch {
      toast.error('Failed to edit patient. Please check the form.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            Edit Patient Identity
          </DialogTitle>
          <DialogDescription>
            Edit the patient&apos;s name and profile photo.
          </DialogDescription>
        </DialogHeader>
        <form
          key={patientInfo.uid}
          onSubmit={handleSubmit}
          className='flex flex-col gap-5 p-1'
        >
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='age'>Age</Label>
              <Input
                type='text'
                id='age'
                name='age'
                value={formData.age}
                onChange={handleChange}
              />
              {getFieldError('age') && (
                <p className='text-destructive text-xs'>
                  {getFieldError('age')}
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
                  setFormData((prev) => ({ ...prev, gender: value ?? '' }))
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
              {getFieldError('user.gender') && (
                <p className='text-destructive text-xs'>
                  {getFieldError('user.gender')}
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <div className='space-y-1.5'>
              <Label htmlFor='blood_group'>Blood Group</Label>

              <Select
                items={BLOOD_GROUP_OPTIONS}
                value={formData.blood_group}
                onValueChange={(value) =>
                  updateField('blood_group', value as string)
                }
              >
                <SelectTrigger
                  id='blood_group'
                  className='w-full'
                  aria-invalid={!!getFieldError('user.blood_group')}
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

              {getFieldError('user.blood_group') && (
                <p className='text-destructive text-xs'>
                  {getFieldError('user.blood_group')}
                </p>
              )}
            </div>
          </div>

          {isError && getFieldError('non_field_errors') && (
            <p className='text-destructive text-sm'>
              {getFieldError('non_field_errors')}
            </p>
          )}

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

export default EditPatientPersonalInfoDialog;
