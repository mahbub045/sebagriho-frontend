export const formatChoiceFieldValue = <T>(value: T): string | null => {
  if (value === null || value === undefined || value === '') return null;
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'string') return value.replace(/_/g, ' ').trim();
  return String(value);
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

export default formatChoiceFieldValue;
