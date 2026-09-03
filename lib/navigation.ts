import { LayoutDashboard, type LucideIcon } from 'lucide-react';

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
