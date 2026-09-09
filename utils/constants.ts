export const PAGE_LIMIT = 12;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

// Strip a leading +88 / 88 country code, leaving just the 11-digit local number.
export const stripCountryCode = (phone: string | null) =>
  (phone ?? '').replace(/^\+?88/, '');

// Add the Bangladesh country code to a local number without duplicating it.
export const addCountryCode = (phone: string | null) =>
  phone ? `+88${stripCountryCode(phone)}` : null;

// Subdomain regex: allows lowercase letters, numbers, and hyphens, but not starting or ending with a hyphen, and no consecutive hyphens.
export const SUBDOMAIN_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
