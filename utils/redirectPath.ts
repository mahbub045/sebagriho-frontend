const ORGANIZATION_DASHBOARD_PATHS: Record<string, string> = {
  CHAMBER: '/organization/chamber/dashboard',
  HOSPITAL: '/organization/hospital/dashboard',
  CLINIC: '/organization/clinic/dashboard',
  LABORATORY: '/organization/laboratory/dashboard',
  PHARMACY: '/organization/pharmacy/dashboard',
  DIAGNOSTIC_CENTER: '/organization/diagnostic-center/dashboard',
  BLOOD_BANK: '/organization/blood-bank/dashboard',
  AMBULANCE_SERVICE: '/organization/ambulance-service/dashboard',
  HOMEOPATHY: '/organization/homeopathy/dashboard',
  AYURVEDIC: '/organization/ayurvedic/dashboard',
  DENTAL: '/organization/dental/dashboard',
  VETERINARY: '/organization/veterinary/dashboard',
};

export function getDashboardPath(
  isAdmin: boolean,
  organization_type?: string,
): string {
  if (isAdmin) {
    return '/super-admin/dashboard';
  }

  if (!isAdmin) {
    return (
      ORGANIZATION_DASHBOARD_PATHS[organization_type ?? ''] ??
      '/auth/access-denied'
    );
  }

  return '/auth/access-denied';
}
