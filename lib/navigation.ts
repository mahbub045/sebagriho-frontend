import { Building2, LayoutDashboard, type LucideIcon } from 'lucide-react';

export type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
};

export const buildItems = (
  isAdmin = false,
  organizationSlug?: string,
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
        icon: Building2,
      },
      {
        label: 'Users',
        href: '/super-admin/users',
        icon: Building2,
      },
      {
        label: 'Users',
        href: '/super-admin/users',
        icon: Building2,
      },
      {
        label: 'Users',
        href: '/super-admin/users',
        icon: Building2,
      },
      {
        label: 'Users',
        href: '/super-admin/users',
        icon: Building2,
      },
      {
        label: 'Users',
        href: '/super-admin/users',
        icon: Building2,
      },

    ];
  }

  const dashboardHref = organizationSlug
    ? `/${organizationSlug}/dashboard`
    : '/dashboard';

  return [
    {
      label: 'Dashboard',
      href: dashboardHref,
      icon: LayoutDashboard,
    },
  ];
};
