import {
  FileText,
  House,
  Landmark,
  LayoutDashboard,
  ShieldUser,
  Ticket,
  UsersRound,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
};

export const buildItems = (): NavItem[] => {
  return [
    {
      label: 'Dashboard',
      href: '/client/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Properties',
      href: '/client/properties',
      icon: House,
    },
    {
      label: 'Mortgages',
      href: '/client/mortgages',
      icon: Landmark,
    },
    {
      label: 'Tenants',
      href: '/client/tenants',
      icon: UsersRound,
    },
    {
      label: 'Compliance',
      href: '/client/compliance',
      icon: ShieldUser,
    },
    {
      label: 'Documents',
      href: '/client/documents',
      icon: FileText,
    },
    {
      label: 'Maintenance',
      href: '/client/maintenance',
      icon: Wrench,
    },
    {
      label: 'Support Tickets',
      href: '/client/support-tickets',
      icon: Ticket,
    },
  ];
};
