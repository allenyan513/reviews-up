'use client';

import * as React from 'react';
import {
  IconSettings,
  IconStar,
  IconCode,
  IconTable,
  IconCirclesRelation,
  IconHourglassEmpty,
  IconMail,
  IconClipboardText,
  IconCheckbox,
  IconForbid2,
  IconList,
  IconDashboard,
  IconUser,
  IconRocket,
  IconClipboard,
  IconHeart,
} from '@tabler/icons-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { useUserContext } from '@/context/UserProvider';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { NavProduct } from '@/components/nav-product';

const data = {
  title: 'Reviewsup.io',
  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const lang = props.lang;
  const { user, defaultProduct, signOut, deleteAccount } = useUserContext();
  const path = usePathname();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL}`}>
                <Logo />
                <h1 className="text-base font-semibold">{data.title}</h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="justify-between">
        <NavMain
          product={defaultProduct}
          items={[
            {
              title: 'Overview',
              url: `/${lang}/dashboard/${defaultProduct?.id}/overview`,
              icon: IconDashboard,
              active: path.includes('/overview'),
            },
            {
              title: 'Reviews',
              url: `/${lang}/dashboard/${defaultProduct?.id}/reviews/all`,
              icon: IconStar,
              active: false,
              children: [
                {
                  title: 'All',
                  url: `/${lang}/dashboard/${defaultProduct?.id}/reviews/all`,
                  icon: IconList,
                  active: path.includes('/reviews/all'),
                },
                {
                  title: 'Pending',
                  url: `/${lang}/dashboard/${defaultProduct?.id}/reviews/pending`,
                  icon: IconHourglassEmpty,
                  active: path.includes('/reviews/pending'),
                },
                {
                  title: 'Public',
                  url: `/${lang}/dashboard/${defaultProduct?.id}/reviews/public`,
                  icon: IconCheckbox,
                  active: path.includes('/reviews/public'),
                },
                {
                  title: 'Hidden',
                  url: `/${lang}/dashboard/${defaultProduct?.id}/reviews/hidden`,
                  icon: IconForbid2,
                  active: path.includes('/reviews/hidden'),
                },
              ],
            },

            {
              title: 'Widgets',
              url: `/${lang}/dashboard/${defaultProduct?.id}/widgets`,
              icon: IconCode,
              active: path.includes('/widgets'),
            },
            {
              title: 'Pages',
              url: `/${lang}/dashboard/${defaultProduct?.id}/pages/wall-of-love`,
              icon: IconClipboard,
              active: false,
              children: [
                {
                  title: 'Wall of Love',
                  url: `/${lang}/dashboard/${defaultProduct?.id}/pages/wall-of-love`,
                  icon: IconHeart,
                  active: path.includes('/pages/wall-of-love'),
                },
                {
                  title: 'Collecting Form',
                  url: `/${lang}/dashboard/${defaultProduct?.id}/pages/collecting-form`,
                  icon: IconTable,
                  active: path.includes('/forms/'),
                },
              ],
            },
            {
              title: 'Settings',
              url: `/${lang}/dashboard/${defaultProduct?.id}/settings`,
              icon: IconSettings,
              active: path.includes('/settings'),
            },
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavProduct />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
