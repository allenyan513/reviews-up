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
  IconUser,
  IconRocket,
} from '@tabler/icons-react';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
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
              <Link
                target={'_blank'}
                href={`${process.env.NEXT_PUBLIC_WWW_URL}`}
              >
                <Logo />
                <h1 className="text-base font-semibold">{data.title}</h1>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          product={defaultProduct}
          items={[
            {
              title: 'Reviews',
              url: `/${lang}/${defaultProduct?.id}/reviews/all`,
              icon: IconStar,
              active: false,
              children: [
                {
                  title: 'All',
                  url: `/${lang}/${defaultProduct?.id}/reviews/all`,
                  icon: IconList,
                  active: path.includes('/reviews/all'),
                },
                {
                  title: 'Pending',
                  url: `/${lang}/${defaultProduct?.id}/reviews/pending`,
                  icon: IconHourglassEmpty,
                  active: path.includes('/reviews/pending'),
                },
                {
                  title: 'Public',
                  url: `/${lang}/${defaultProduct?.id}/reviews/public`,
                  icon: IconCheckbox,
                  active: path.includes('/reviews/public'),
                },
                {
                  title: 'Hidden',
                  url: `/${lang}/${defaultProduct?.id}/reviews/hidden`,
                  icon: IconForbid2,
                  active: path.includes('/reviews/hidden'),
                },
              ],
            },

            {
              title: 'Widgets',
              url: `/${lang}/${defaultProduct?.id}/widgets`,
              icon: IconCode,
              active: path.includes('/widgets'),
            },
            {
              title: 'Forms',
              url: `/${lang}/${defaultProduct?.id}/forms`,
              icon: IconTable,
              active: path.includes('/forms'),
            },
            {
              title: 'Community',
              url: `/${lang}/${defaultProduct?.id}/community/launch`,
              icon: IconCirclesRelation,
              active: false,
              children: [
                {
                  title: 'My Product',
                  url: `/${lang}/${defaultProduct?.id}/community/launch`,
                  icon: IconUser,
                  active: path.includes('/community/launch'),
                },
                {
                  title: 'Explore',
                  url: `/${lang}/${defaultProduct?.id}/community/explore`,
                  icon: IconList,
                  active: path.includes('/community/explore'),
                }]
            },
            {
              title: 'Settings',
              url: `/${lang}/${defaultProduct?.id}/settings`,
              icon: IconSettings,
              active: path.includes('/settings'),
            },
          ]}
        />
        <NavSecondary
          items={[
            {
              title: 'Documents',
              url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs`,
              icon: IconClipboardText,
              external: true,
            },
            {
              title: 'Contact Us',
              url: 'mailto:support@reviewsup.io',
              icon: IconMail,
            },
          ]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || '',
            email: user?.email || '',
            avatar: user?.avatarUrl || '',
          }}
          signOut={signOut}
          deleteAccount={deleteAccount}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
