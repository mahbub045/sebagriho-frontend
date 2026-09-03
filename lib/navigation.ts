import { LayoutDashboard, type LucideIcon } from 'lucide-react';

export type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
};

export const buildItems = (isAdmin = false): NavItem[] => {
  if (isAdmin) {
    return [
      {
        label: 'Dashboard',
        href: '/super-admin/dashboard',
        icon: LayoutDashboard,
      },
    ];
  }
  return [
    {
      label: 'Dashboard',
      href: '/[organizationslug]/dashboard',
      icon: LayoutDashboard,
    },
  ];
};
