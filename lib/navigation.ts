import {
  Building2,
  LayoutDashboard,
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
