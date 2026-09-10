import { ApiValidationError } from '@/types/common/CommonTypes';

export const getChangedFields = <T extends Record<string, unknown>>(
  original: T,
  current: T,
): Partial<T> => {
  const changed: Partial<T> = {};

  (Object.keys(current) as Array<keyof T>).forEach((key) => {
    if (current[key] !== original[key]) {
      changed[key] = current[key];
    }
  });

  return changed;
};

export const getFieldErrors = (error: unknown): Record<string, string> => {
  const err = error as ApiValidationError;
  const data = err?.data;
  if (!data || typeof data !== 'object') return {};

  return Object.entries(data).reduce<Record<string, string>>(
    (acc, [field, value]) => {
      // skip non-field keys some APIs mix in
      if (field === 'detail' || field === 'message') return acc;
      acc[field] = Array.isArray(value) ? value[0] : String(value);
      return acc;
    },
    {},
  );
};
