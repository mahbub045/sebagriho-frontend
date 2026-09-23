import {
  BookOpen,
  Building2,
  LayoutDashboard,
  Pill,
  Stethoscope,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type en from '@/lib/i18n/dictionaries/en.json';

export type NavItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  badge?: number;
  children?: NavItem[];
};

type NavDict = (typeof en)['nav'];

export const buildItems = (
  isAdmin = false,
  organizationType: string | undefined,
  nav: NavDict,
): NavItem[] => {
  if (isAdmin) {
    return [
      {
        label: nav.dashboard,
        href: '/super-admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: nav.organizations,
        href: '/super-admin/organizations',
        icon: Building2,
      },
      {
        label: nav.users,
        href: '/super-admin/users',
        icon: Users,
      },
    ];
  }

  if (!isAdmin && organizationType === 'HOMEOPATHY') {
    return [
      {
        label: nav.dashboard,
        href: '/organization/homeopathy/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: nav.patients,
        href: '/organization/homeopathy/patients',
        icon: Users,
      },
      {
        label: nav.appointments,
        href: '/organization/homeopathy/appointments',
        icon: Stethoscope,
      },
      {
        label: nav.repertories,
        href: '/organization/homeopathy/repertories',
        icon: BookOpen,
      },
      {
        label: nav.medicines,
        href: '/organization/homeopathy/medicines',
        icon: Pill,
      },
    ];
  }

  if (!isAdmin && organizationType === 'AYURVEDIC') {
    return [
      {
        label: nav.dashboard,
        href: '/organization/ayurvedic/dashboard',
        icon: LayoutDashboard,
      },
    ];
  }

  return [];
};
