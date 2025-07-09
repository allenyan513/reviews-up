'use client';

import * as React from 'react';
import {
  IconInnerShadowTop,
  IconSettings,
  IconStar,
  IconCode,
  IconTable,
  IconUser,
  IconMail,
  IconClipboardText,
  IconRocket,
  IconBuildingStore,
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
  const { user, defaultWorkspace, signOut, deleteAccount } = useUserContext();
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
          workspace={defaultWorkspace}
          items={[
            {
              title: 'Reviews',
              url: `/${lang}/${defaultWorkspace?.id}/reviews`,
              icon: IconStar,
              active: path.includes('/reviews'),
            },
            {
              title: 'Showcases',
              url: `/${lang}/${defaultWorkspace?.id}/showcases`,
              icon: IconCode,
              active: path.includes('/showcases'),
            },
            {
              title: 'Forms',
              url: `/${lang}/${defaultWorkspace?.id}/forms`,
              icon: IconTable,
              active: path.includes('/forms'),
            },
            {
              title: 'Launch',
              url: `/${lang}/${defaultWorkspace?.id}/promotion/my-products`,
              icon: IconRocket,
              active: false,
              children: [
                {
                  title: 'My products',
                  url: `/${lang}/${defaultWorkspace?.id}/promotion/my-products`,
                  icon: IconUser,
                  active: path.includes('/promotion/my-products'),
                },
                {
                  title: 'Apps to Review',
                  url: `/${lang}/${defaultWorkspace?.id}/promotion/apps-to-review`,
                  icon: IconBuildingStore,
                  active: path.includes('/promotion/apps-to-review'),
                },
              ],
            },
            {
              title: 'Settings',
              url: `/${lang}/settings`,
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
