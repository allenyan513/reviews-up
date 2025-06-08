'use client';

import * as React from 'react';
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers
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
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { User } from '@repo/api/users/entities/user.entity';
import { api } from '@/lib/apiClient';
import { Workspace } from '@repo/api/workspaces/entities/workspace.entity';
import { usePathname } from 'next/navigation';
import { useUserContext } from '@/context/UserProvider';

const data = {
  title: 'ReviewUp',
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },
  navMain: [
    {
      title: 'Forms',
      url: '/',
      icon: IconDashboard
    },
    {
      title: 'Reviews',
      url: '#',
      icon: IconListDetails
    },
    {
      title: 'Widgets',
      url: '#',
      icon: IconChartBar
    }
  ],
  navSecondary: [
    // {
    //   title: 'Settings',
    //   url: '/settings',
    //   icon: IconSettings
    // },
    // {
    //   title: 'feedback',
    //   url: '/feedback',
    //   icon: IconHelp
    // }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const lang = props.lang;
  const { data: session } = useSession();

  const {defaultWorkspace} = useUserContext();
  const path = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{data.title}</span>
              </a>
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
              icon: IconListDetails,
              active: path.includes('/reviews')
            },
            {
              title: 'Widgets',
              url: `/${lang}/${defaultWorkspace?.id}/widgets`,
              icon: IconChartBar,
              active: path.includes('/widgets')
            },
            {
              title: 'Collect Forms',
              url: `/${lang}/${defaultWorkspace?.id}/forms`,
              icon: IconDashboard,
              active: path.includes('/forms')
            },
            {
              title: 'Settings',
              url: `/${lang}/settings`,
              icon: IconDashboard,
              active: path.includes('/forms')
            },
          ]}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user.name || '',
            email: session?.user.email || '',
            avatar: session?.user.image || ''
          }}
          signOut={() => {
            signOut({
              callbackUrl: '/'
            });
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
