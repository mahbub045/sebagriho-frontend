export const formatChoiceFieldValue = (
  choiceFieldValue?: string | null,
): string => {
  if (!choiceFieldValue) return '';
  return choiceFieldValue
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getInitials = (value?: string | null): string => {
  if (!value) return 'U';

  const initials = value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? '')
    .join('');

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
