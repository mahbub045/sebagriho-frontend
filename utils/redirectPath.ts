export function getDashboardPath(
  isAdmin: boolean,
  organization_type?: string,
): string {
  if (isAdmin) {
    return '/super-admin/dashboard';
  }

  if (!isAdmin) {
    if (organization_type === 'HOMEOPATHY') {
      return '/organization/homeopathy/dashboard';
    }
    if (organization_type === 'AYURVEDIC') {
      return '/organization/ayurvedic/dashboard';
    }
  }

  return '/auth/access-denied';
}
