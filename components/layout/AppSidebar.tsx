'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { buildItems, type NavItem } from '@/lib/navigation';
import { useGetProfileInfoQuery } from '@/lib/services/endpoints/common/ProfileInfoApi';
import { cn } from '@/lib/utils';
import { getInitials } from '@/utils/formatters';
import { ChevronRight, LogOut, Menu, Settings, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import Loading from '../common/CustomLoader/Loading';
import { handleSignOut } from '../SignOut';
import { Badge } from '../ui/badge';

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Returns the labels of all parent items that have an active child for the
// given pathname. Used to auto-expand the correct submenu on mount and
// whenever the route changes.
function getActiveParentLabels(items: NavItem[], pathname: string): string[] {
  const labels: string[] = [];
  for (const item of items) {
    if (Array.isArray(item.children) && item.children.length > 0) {
      const hasActiveChild = item.children.some(
        (child) => child.href && isNavActive(pathname, child.href),
      );
      if (hasActiveChild) {
        labels.push(item.label);
      }
    }
  }
  return labels;
}

// True if this item (or any of its children) is the active route.
function isItemActive(item: NavItem, pathname: string): boolean {
  if (item.href && isNavActive(pathname, item.href)) return true;
  if (Array.isArray(item.children)) {
    return item.children.some(
      (child) => child.href && isNavActive(pathname, child.href),
    );
  }
  return false;
}

// The first navigable href for an item — its own href, or its first child's.
function firstHref(item: NavItem): string | undefined {
  if (item.href) return item.href;
  return item.children?.find((c) => c.href)?.href;
}

// Unique, deterministic colors for icons — same label always maps to the same
// color, regardless of active/inactive state. Defined at module scope so the
// array/function identity is stable across renders.
const ICON_COLORS = [
  '#6366f1', // indigo
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ef4444', // red
  '#22c55e', // green
  '#06b6d4', // cyan
  '#f97316', // orange
  '#0ea5e9', // sky
  '#a855f7', // purple
  '#84cc16', // lime
  '#f43f5e', // rose
  '#10b981', // emerald
  '#eab308', // yellow
  '#3b82f6', // blue
  '#d946ef', // fuchsia
  '#0d9488', // teal-dark
  '#dc2626', // red-dark
  '#65a30d', // lime-dark
  '#ea580c', // orange-dark
  '#7c3aed', // violet-dark
  '#0891b2', // cyan-dark
  '#db2777', // pink-dark
  '#059669', // emerald-dark
  '#4f46e5', // indigo-dark
  '#9333ea', // purple-dark
  '#ca8a04', // amber-dark
  '#e11d48', // rose-dark
  '#2563eb', // blue-dark
  '#16a34a', // green-dark
  '#c026d3', // fuchsia-dark
  '#0284c7', // sky-dark
  '#b91c1c', // red-darker
  '#15803d', // green-darker
  '#6d28d9', // violet-darker
  '#be185d', // pink-darker
  '#a16207', // yellow-dark
  '#0e7490', // cyan-darker
  '#4338ca', // indigo-darker
  '#c2410c', // orange-darker
];

function getIconColor(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ICON_COLORS[Math.abs(hash) % ICON_COLORS.length];
}

function NavMenu({ items, pathname }: { items: NavItem[]; pathname: string }) {
  // Initialize from the current route instead of always starting empty, so
  // a hard reload lands with the correct submenu already expanded.
  const [openItems, setOpenItems] = React.useState<Set<string>>(
    () => new Set(getActiveParentLabels(items, pathname)),
  );

  // Track the pathname we last synced against. When it changes (e.g.
  // client-side navigation into a submenu item without the sidebar
  // remounting), adjust openItems during render instead of in an effect —
  // this is React's recommended pattern for deriving state from a changed
  // prop, and avoids the extra "commit -> effect -> setState -> re-render"
  // round trip. This only ever adds labels, so it never collapses a
  // submenu the user has manually toggled.
  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);

    const activeLabels = getActiveParentLabels(items, pathname);
    const missing = activeLabels.filter((label) => !openItems.has(label));
    if (missing.length > 0) {
      const next = new Set(openItems);
      missing.forEach((label) => next.add(label));
      setOpenItems(next);
    }
  }

  const toggleOpen = (label: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const isParentActive = (item: NavItem): boolean =>
    isItemActive(item, pathname);

  return (
    <SidebarMenu>
      {items.map((item, index) => {
        // Ensure unique keys by combining href, label, and index
        const key = `${item.href || item.label}-${index}`;
        const hasChildren =
          Array.isArray(item.children) && item.children.length > 0;
        const isActive = isParentActive(item);

        return (
          <SidebarMenuItem key={key}>
            {hasChildren ? (
              <>
                <SidebarMenuButton
                  onClick={() => toggleOpen(item.label)}
                  isActive={isActive}
                  tooltip={item.label}
                  style={
                    isActive
                      ? { borderBottomColor: getIconColor(item.label) }
                      : undefined
                  }
                  className='h-9 cursor-pointer rounded-lg border-b-2 border-transparent data-active:bg-black/10 data-active:shadow-none data-active:hover:bg-black/15 dark:data-active:bg-white/15 dark:data-active:hover:bg-white/20'
                >
                  <item.icon style={{ color: getIconColor(item.label) }} />
                  <span>{item.label}</span>
                  <ChevronRight
                    className={cn(
                      'ml-auto transition-transform',
                      openItems.has(item.label) && 'rotate-90',
                    )}
                  />
                </SidebarMenuButton>
                {openItems.has(item.label) && (
                  <SidebarMenuSub>
                    {item.children!.map((child, childIndex) => {
                      const childActive = child.href
                        ? isNavActive(pathname, child.href)
                        : false;
                      const childKey = `${child.href || child.label}-${childIndex}`;
                      return (
                        <SidebarMenuSubItem key={childKey}>
                          <SidebarMenuSubButton
                            render={<Link href={child.href || '#'} />}
                            isActive={childActive}
                            style={
                              childActive
                                ? {
                                    borderBottomColor: getIconColor(
                                      child.label,
                                    ),
                                  }
                                : undefined
                            }
                            className='h-9 rounded-lg border-b-2 border-transparent data-active:bg-black/5 data-active:shadow-none data-active:hover:bg-black/10 dark:data-active:bg-white/10 dark:data-active:hover:bg-white/15'
                          >
                            <child.icon
                              style={{ color: getIconColor(child.label) }}
                              className='h-4 w-4'
                            />

                            <span>{child.label}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                )}
              </>
            ) : (
              item.href && (
                <>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={isNavActive(pathname, item.href)}
                    tooltip={item.label}
                    style={
                      isNavActive(pathname, item.href)
                        ? { borderBottomColor: getIconColor(item.label) }
                        : undefined
                    }
                    className='h-9 rounded-lg border-b-2 border-transparent data-active:bg-black/10 data-active:hover:bg-black/15 dark:data-active:bg-white/10 dark:data-active:hover:bg-white/15'
                  >
                    <item.icon style={{ color: getIconColor(item.label) }} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.badge ? (
                    <SidebarMenuBadge className='bg-danger rounded-full px-1.5 text-[10px] font-semibold text-white!'>
                      {item.badge}
                    </SidebarMenuBadge>
                  ) : null}
                </>
              )
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

// Facebook-style bottom tab bar for mobile. Shows the first few top-level
// nav items as direct tabs, plus a "Menu" tab that opens a bottom sheet with
// the full nav tree and account actions.
function MobileBottomNav({
  items,
  pathname,
  profileData,
}: {
  items: NavItem[];
  pathname: string;
  profileData?: { name?: string; phone?: string; profile_image?: string };
}) {
  const MAX_TABS = 4;
  const tabItems = items.slice(0, MAX_TABS);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  return (
    <nav className='bg-background/95 supports-backdrop-blur:bg-background/80 fixed inset-x-0 bottom-0 z-50 flex h-14 items-stretch border-t pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden'>
      {tabItems.map((item, index) => {
        const active = isItemActive(item, pathname);
        const href = firstHref(item);
        const color = getIconColor(item.label);

        return (
          <Link
            key={`${item.href ?? item.label}-${index}`}
            href={href || '#'}
            className='flex flex-1 flex-col items-center justify-center gap-1'
          >
            <item.icon
              className='h-5.5 w-5.5 shrink-0 stroke-[1.75]'
              style={{ color }}
            />
            <span
              className={cn(
                'max-w-full truncate px-1 text-[10px] leading-none font-medium',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}

      <button
        type='button'
        onClick={() => setSheetOpen(true)}
        className='flex flex-1 flex-col items-center justify-center gap-1'
      >
        <Menu
          className='h-5.5 w-5.5 shrink-0 stroke-[1.75]'
          style={{ color: getIconColor('Menu') }}
        />
        <span className='text-muted-foreground text-[10px] leading-none font-medium'>
          Menu
        </span>
      </button>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side='bottom' className='max-h-[85vh] overflow-y-auto'>
          <SheetHeader>
            <SheetTitle className='flex items-center gap-3 text-left'>
              <Avatar size='lg'>
                <AvatarImage
                  src={profileData?.profile_image ?? undefined}
                  alt='User profile picture'
                />
                <AvatarFallback className='bg-primary text-xs font-semibold text-white'>
                  {getInitials(profileData?.name) ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0'>
                <p className='truncate text-sm font-semibold'>
                  {profileData?.name ?? 'User'}
                </p>
                <p className='text-muted-foreground truncate text-xs font-normal'>
                  {profileData?.phone}
                </p>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className='px-2 pb-2'>
            <NavMenu items={items} pathname={pathname} />
          </div>

          <SidebarSeparator className='mx-2 h-px!' />

          <div className='space-y-1 p-2'>
            <Link
              href='/client/profile-settings'
              onClick={() => setSheetOpen(false)}
              className='hover:bg-accent flex items-center gap-2 rounded-lg px-3 py-2 text-sm'
            >
              <User className='size-4' />
              Profile Settings
            </Link>
            <button
              type='button'
              onClick={() => {
                setSheetOpen(false);
                handleSignOut();
              }}
              className='hover:bg-accent text-destructive flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm'
            >
              <LogOut className='size-4' />
              Sign out
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}

const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Extract organization slug from pathname (e.g., '/acme/dashboard' -> 'acme')
  const organizationSlug = pathname.split('/')[1];

  const navItems = buildItems(
    Boolean(session?.user.is_admin),
    organizationSlug,
  );

  const { data: profileData, isLoading } = useGetProfileInfoQuery(undefined);

  if (isLoading) {
    return (
      <>
        <Sidebar collapsible='icon'>
          <div className='flex h-full items-center justify-center'>
            <Loading />
          </div>
        </Sidebar>
        <div className='bg-background fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-center border-t md:hidden'>
          <Loading />
        </div>
      </>
    );
  }

  const getProfilePath = () => '/client/profile-settings';

  return (
    <>
      <Sidebar collapsible='icon'>
        <SidebarHeader className='gap-0 px-4 py-4 group-data-[collapsible=icon]:px-2'>
          <div className='flex items-center gap-2 group-data-[collapsible=icon]:hidden'>
            <Image
              src='/images/logo-black.png'
              alt='Sebagriho'
              width={400}
              height={150}
              className='h-12 w-40 rounded-xl dark:hidden'
              loading='eager'
            />
            <Image
              src='/images/logo-white.png'
              alt='Sebagriho'
              width={400}
              height={150}
              className='hidden h-12 w-40 rounded-xl dark:block'
              loading='eager'
            />
          </div>

          <Badge
            variant='secondary'
            className='group-data-[collapsible=icon]:hidden'
          >
            Premium Plan
          </Badge>
        </SidebarHeader>

        <SidebarSeparator className='mx-0 h-px!' />

        <SidebarContent className='gap-1 px-2 py-2'>
          <SidebarGroup className='p-0'>
            <SidebarGroupLabel className='px-3 text-[11px] font-semibold tracking-wider uppercase'>
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <NavMenu items={navItems} pathname={pathname} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className='p-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2'>
          <SidebarSeparator className='mx-0 h-px!' />

          <DropdownMenu>
            <DropdownMenuTrigger className='flex w-full cursor-pointer items-center gap-3 rounded-lg p-1 text-left transition-colors outline-none group-data-[collapsible=icon]:justify-center'>
              <Avatar size='lg'>
                <AvatarImage
                  src={profileData?.profile_image ?? undefined}
                  alt='User profile picture'
                />
                <AvatarFallback className='bg-primary text-xs font-semibold text-white'>
                  {getInitials(profileData?.name) ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0 group-data-[collapsible=icon]:hidden'>
                <p className='truncate text-sm font-semibold'>
                  {profileData?.name ?? 'User'}
                </p>
              </div>
              <Settings size={16} />
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className='flex flex-col gap-1'>
                    <span className='font-medium'>{profileData?.name}</span>
                    <span className='text-muted-foreground text-xs font-normal'>
                      {profileData?.phone}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <Link href={getProfilePath()} passHref>
                <DropdownMenuItem className='cursor-pointer'>
                  <User className='size-4' />
                  Profile Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant='destructive'
                onClick={() => handleSignOut()}
                className='cursor-pointer'
              >
                <LogOut className='size-4' />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <MobileBottomNav
        items={navItems}
        pathname={pathname}
        profileData={profileData}
      />
    </>
  );
};

export default AppSidebar;
