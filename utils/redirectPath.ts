export function getDashboardPath(isAdmin: boolean): string {
  if (isAdmin) {
    return '/super-admin/dashboard';
  }

  if (!isAdmin) {
    return '/organization/dashboard';
  }

  return '/auth/access-denied';
}
