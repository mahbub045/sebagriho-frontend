'use client';

import AuthPageSidePanel from '@/components/common/AuthPageSidePanel/AuthPageSidePanel';
import Loading from '@/components/common/CustomLoader/Loading';
import { handleSignOut } from '@/components/SignOut';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useSetPasswordMutation } from '@/lib/services/endpoints/common/SetPasswordApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Eye, EyeOff } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type FormData = {
  password: string;
  password_confirm: string;
};

const INITIAL_FORM_DATA: FormData = {
  password: '',
  password_confirm: '',
};

type FieldErrors = Partial<
  Record<keyof FormData | 'non_field_errors', string[] | string>
>;

export default function SetPasswordPage() {
  const router = useRouter();
  const { update } = useSession();
  const { dict } = useTranslation();
  const [setPassword, { isLoading, isError, error }] = useSetPasswordMutation();

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [visibility, setVisibility] = useState({
    password: false,
    password_confirm: false,
  });
  const [mismatchError, setMismatchError] = useState<string | undefined>();

  const fieldErrors: FieldErrors =
    (error as { data?: FieldErrors })?.data ?? {};

  const getFieldError = (field: keyof FormData) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirm) {
      setMismatchError(dict.authPages.setPassword.passwordMismatch);
      return;
    }

    try {
      await setPassword(formData).unwrap();

      // Reflect the change in the session so the (MainBody) layout guard
      // stops bouncing this user back here on their next navigation.
      await update({ is_password_set: true });

      toast.success(dict.authPages.setPassword.setSuccess);
      router.push('/');
    } catch {
      toast.error(dict.authPages.setPassword.setError);
    }
  };

  const renderPasswordField = (field: keyof FormData, label: string) => (
    <div className='space-y-1.5'>
      <label
        htmlFor={field}
        className='text-xs font-medium text-slate-700 dark:text-slate-300'
      >
        {label}
      </label>

      <div className='relative'>
        <Input
          id={field}
          name={field}
          type={visibility[field] ? 'text' : 'password'}
          placeholder={`${dict.authPages.setPassword.enterPrefix} ${label.toLowerCase()}`}
          value={formData[field]}
          onChange={handleChange}
          required
          aria-invalid={!!getFieldError(field)}
          className='h-10 border-slate-200 bg-slate-50 pr-10 text-sm dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500'
        />

        <button
          type='button'
          onClick={() => toggleVisibility(field)}
          className='text-primary/70 hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition'
          aria-label={
            visibility[field]
              ? dict.authPages.setPassword.hidePassword
              : dict.authPages.setPassword.showPassword
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
    <div className='flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_35%),linear-gradient(135deg,#f8fafc_0%,#eef4ff_50%,#f8fafc_100%)] p-4 dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_35%),linear-gradient(135deg,#020617_0%,#0b1220_50%,#020617_100%)]'>
      <div className='grid w-full max-w-242.5 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.14)] lg:min-h-93.75 lg:grid-cols-[1.1fr_0.9fr] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]'>
        <AuthPageSidePanel />

        <div className='relative flex items-center justify-center p-6 sm:p-8 lg:p-9'>
          <div className='absolute top-4 right-4'>
            <ThemeToggle />
          </div>

          <div className='w-full max-w-90'>
            <div className='mb-2 flex items-center justify-center'>
              <Image
                src='/images/logo-white.png'
                alt='Sebagriho'
                width={400}
                height={150}
                className='h-12 w-40 rounded-xl dark:hidden'
                loading='eager'
              />
              <Image
                src='/images/logo-white.png'
                alt='Sebagriho'
                width={400}
                height={150}
                className='hidden h-12 w-40 rounded-xl dark:block'
                loading='eager'
              />
            </div>

            <div className='mb-5'>
              <p className='text-primary text-[11px] font-semibold tracking-[0.3em] uppercase'>
                {dict.authPages.setPassword.eyebrow}
              </p>

              <h2 className='mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>
                {dict.authPages.setPassword.heading}
              </h2>

              <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
                {dict.authPages.setPassword.subheading}
              </p>
            </div>

            <form className='space-y-4' onSubmit={handleSubmit}>
              {renderPasswordField(
                'password',
                dict.authPages.setPassword.newPassword,
              )}
              {renderPasswordField(
                'password_confirm',
                dict.authPages.setPassword.confirmPassword,
              )}

              {(mismatchError ||
                (isError &&
                  (fieldErrors.non_field_errors as string[] | undefined))) && (
                <p className='text-destructive text-sm'>
                  {mismatchError ||
                    (fieldErrors.non_field_errors as string[])?.[0]}
                </p>
              )}

              <Button
                type='submit'
                disabled={isLoading}
                className='bg-primary hover:bg-primary/85 mt-2 h-10 w-full rounded-lg text-sm font-medium text-white'
              >
                {isLoading ? (
                  <Loading className='text-white!' />
                ) : (
                  dict.authPages.setPassword.submitButton
                )}
              </Button>

              <button
                type='button'
                onClick={() => handleSignOut()}
                className='text-primary cursor-pointer block w-full text-center text-xs font-medium hover:underline'
              >
                {dict.authPages.setPassword.signOutInstead}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
