export function getDashboardPath(
  isAdmin: boolean,
  organizationSlug?: string,
): string {
  if (isAdmin) {
    return '/super-admin/dashboard';
  }

  if (organizationSlug) {
    return `/${organizationSlug}/dashboard`;
  }

  return '/[organizationslug]/dashboard';
}
