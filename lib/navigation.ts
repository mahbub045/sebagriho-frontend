import {
  Building2,
  LayoutDashboard,
  Pill,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
};

export const buildItems = (
  isAdmin = false,
  organizationType?: string,
): NavItem[] => {
  if (isAdmin) {
    return [
      {
        label: 'Dashboard',
        href: '/super-admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Organizations',
        href: '/super-admin/organizations',
        icon: Building2,
      },
      {
        label: 'Users',
        href: '/super-admin/users',
        icon: Users,
      },
    ];
  }

  if (!isAdmin && organizationType === 'HOMEOPATHY') {
    return [
      {
        label: 'Dashboard',
        href: '/organization/homeopathy/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Patients',
        href: '/organization/homeopathy/patients',
        icon: Users,
      },
      {
        label: 'Appointments',
        href: '/organization/homeopathy/appointments',
        icon: Stethoscope,
      },
      {
        label: 'Medicines',
        href: '/organization/homeopathy/medicines',
        icon: Pill,
      },
    ];
  }

  if (!isAdmin && organizationType === 'AYURVEDIC') {
    return [
      {
        label: 'Dashboard',
        href: '/organization/ayurvedic/dashboard',
        icon: LayoutDashboard,
      },
    ];
  }

  return [];
};
