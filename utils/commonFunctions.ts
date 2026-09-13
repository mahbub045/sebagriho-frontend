export function getChangedFields<T extends object>(
  current: T,
  initial: T,
): Partial<T> {
  const result: Partial<T> = {};
  (Object.keys(current) as (keyof T)[]).forEach((key) => {
    if (current[key] !== initial[key]) {
      result[key] = current[key];
    }
  });
  return result;
}
