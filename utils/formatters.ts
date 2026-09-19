import { resolveChoiceFieldLabel } from '@/data/common/ChoiceFields';
import { defaultLocale, type Locale } from '@/lib/i18n/config';

export const formatChoiceFieldValue = (
  choiceFieldValue?: string | null,
  locale: Locale = defaultLocale,
): string => {
  if (!choiceFieldValue) return '';
  return resolveChoiceFieldLabel(choiceFieldValue, locale);
};

export const getInitials = (
  firstName?: string | null,
  lastName?: string | null,
): string => {
  const first = firstName?.trim()?.[0] ?? '';
  const last = lastName?.trim()?.[0] ?? '';

  const initials = `${first}${last}`.toUpperCase();

  return initials || 'U';
};

export function formatDateAndTime(isoDate: Date | string | null): string {
  if (isoDate == null) return '';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
}

export function formatDate(isoDate: Date | string | null | undefined): string {
  if (isoDate == null) return '';
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}

export const calculateAge = (dateOfBirth: string | null) => {
  if (!dateOfBirth) return null;

  const dob = new Date(dateOfBirth);

  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;

  return age;
};
