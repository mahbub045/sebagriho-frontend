import Loading from '@/components/common/CustomLoader/Loading';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  EditPatientIdentityDailogProps,
  FieldErrorMap,
} from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { getInitials } from '@/utils/formatters';
import { useState } from 'react';
import { toast } from 'sonner';

const EditPatientIdentityDailog: React.FC<EditPatientIdentityDailogProps> = ({
  isOpen,
  onClose,
  patientInfo,
}) => {
  const { dict } = useTranslation();
  const [editPatient, { isLoading, isError, error }] = useEditPatientMutation();

  const [formData, setFormData] = useState({
    first_name: patientInfo.user.first_name,
    last_name: patientInfo.user.last_name,
    avatarFile: null as File | null,
    avatarPreview: patientInfo.user.avatar,
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('user.first_name', formData.first_name);
    payload.append('user.last_name', formData.last_name);
    if (formData.avatarFile) {
      payload.append('user.avatar', formData.avatarFile);
    }

    try {
      await editPatient({
        patientUid: patientInfo.uid,
        payload,
      }).unwrap();
      onClose();
      toast.success(dict.patients.dialogs.editIdentity.successToast);
    } catch {
      toast.error(dict.patients.dialogs.editIdentity.errorToast);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            {dict.patients.dialogs.editIdentity.title}
          </DialogTitle>
          <DialogDescription>
            {dict.patients.dialogs.editIdentity.description}
          </DialogDescription>
        </DialogHeader>
        <form
          key={patientInfo.uid}
          onSubmit={handleSubmit}
          className='flex flex-col gap-5 p-1'
        >
          <div className='flex items-center gap-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage src={formData.avatarPreview ?? undefined} />
              <AvatarFallback>
                {getInitials(`${formData.first_name} ${formData.last_name}`)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label
                htmlFor='avatar-upload'
                className='text-primary cursor-pointer text-sm font-medium hover:underline'
              >
                {dict.patients.dialogs.editIdentity.changePhoto}
              </Label>
              <Input
                id='avatar-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleAvatarChange}
              />
              {getFieldError('user.avatar') && (
                <p className='text-destructive mt-1 text-xs'>
                  {getFieldError('user.avatar')}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='first_name'>
                {dict.patients.dialogs.editIdentity.firstName}
              </Label>
              <Input
                type='text'
                id='first_name'
                name='first_name'
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              {getFieldError('user.first_name') && (
                <p className='text-destructive text-xs'>
                  {getFieldError('user.first_name')}
                </p>
              )}
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='last_name'>
                {dict.patients.dialogs.editIdentity.lastName}
              </Label>
              <Input
                type='text'
                id='last_name'
                name='last_name'
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              {getFieldError('user.last_name') && (
                <p className='text-destructive text-xs'>
                  {getFieldError('user.last_name')}
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
              {dict.common.cancel}
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loading className='h-4 w-4 text-white!' />}
              {dict.patients.dialogs.saveChanges}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientIdentityDailog;
