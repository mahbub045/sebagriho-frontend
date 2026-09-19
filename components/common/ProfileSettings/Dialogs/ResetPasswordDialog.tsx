'use client';

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
import { useResetPasswordMutation } from '@/lib/services/endpoints/common/ProfileInfoApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  ResetPasswordDialogProps,
  ResetPasswordFieldErrors,
  ResetPasswordFormData,
} from '@/types/common/CommonTypes';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const INITIAL_FORM_DATA: ResetPasswordFormData = {
  old_password: '',
  new_password: '',
  confirm_password: '',
};

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { dict } = useTranslation();
  const [resetPassword, { isLoading, isError, error }] =
    useResetPasswordMutation();

  const [formData, setFormData] =
    useState<ResetPasswordFormData>(INITIAL_FORM_DATA);
  const [visibility, setVisibility] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false,
  });
  const [mismatchError, setMismatchError] = useState<string | undefined>();

  const fieldErrors: ResetPasswordFieldErrors =
    (error as { data?: ResetPasswordFieldErrors })?.data ?? {};

  const getFieldError = (field: keyof ResetPasswordFormData) => {
    const value = fieldErrors[field];
    return Array.isArray(value) ? value[0] : value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMismatchError(undefined);
  };

  const toggleVisibility = (field: keyof typeof visibility) => {
    setVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA);
    setMismatchError(undefined);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirm_password) {
      setMismatchError(dict.profileSettings.resetPassword.passwordMismatch);
      return;
    }

    const payload = new FormData();
    payload.append('old_password', formData.old_password);
    payload.append('new_password', formData.new_password);
    payload.append('confirm_password', formData.confirm_password);

    try {
      await resetPassword({ payload }).unwrap();
      toast.success(dict.profileSettings.resetPassword.updateSuccess);
      handleClose();
    } catch {
      toast.error(dict.profileSettings.resetPassword.updateError);
    }
  };

  const renderPasswordField = (
    field: keyof ResetPasswordFormData,
    label: string,
  ) => (
    <div className='flex flex-col gap-1.5'>
      <Label htmlFor={field}>{label}</Label>
      <div className='relative'>
        <Input
          id={field}
          name={field}
          type={visibility[field] ? 'text' : 'password'}
          value={formData[field]}
          onChange={handleChange}
          required
          className='pr-10'
          aria-invalid={!!getFieldError(field)}
        />
        <button
          type='button'
          onClick={() => toggleVisibility(field)}
          className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition'
          aria-label={
            visibility[field]
              ? dict.profileSettings.resetPassword.hidePassword
              : dict.profileSettings.resetPassword.showPassword
          }
        >
          {visibility[field] ? (
            <EyeOff className='h-4 w-4' />
          ) : (
            <Eye className='h-4 w-4' />
          )}
        </button>
      </div>
      {getFieldError(field) && (
        <p className='text-destructive text-xs'>{getFieldError(field)}</p>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            {dict.profileSettings.resetPassword.title}
          </DialogTitle>
          <DialogDescription>
            {dict.profileSettings.resetPassword.description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-1'>
          {renderPasswordField(
            'old_password',
            dict.profileSettings.resetPassword.currentPassword,
          )}
          {renderPasswordField(
            'new_password',
            dict.profileSettings.resetPassword.newPassword,
          )}
          {renderPasswordField(
            'confirm_password',
            dict.profileSettings.resetPassword.confirmNewPassword,
          )}

          {(mismatchError ||
            (isError &&
              (fieldErrors as { non_field_errors?: string[] })
                ?.non_field_errors)) && (
            <p className='text-destructive text-sm'>
              {mismatchError ||
                (fieldErrors as { non_field_errors?: string[] })
                  .non_field_errors?.[0]}
            </p>
          )}

          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isLoading}
            >
              {dict.profileSettings.resetPassword.cancel}
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loading className='h-4 w-4 text-white!' />}
              {dict.profileSettings.resetPassword.saveChanges}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
