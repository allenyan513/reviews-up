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
    {
      title: 'Settings',
      url: '/settings',
      icon: IconSettings
    },
    {
      title: 'feedback',
      url: '/feedback',
      icon: IconHelp
    }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const lang = props.lang;
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [defaultWorkspaceId, setDefaultWorkspaceId] = useState<string | null>(null);
  useEffect(() => {
    if (!session) return;
    console.log('session', session);
    api
      .getUserProfile({
        session: session
      })
      .then((profile) => {
        console.log(profile);
        setUserProfile(profile);
        setDefaultWorkspaceId(profile.Workspace ? profile.Workspace[0]?.id || null : null);
      });
  }, [session]);

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
          items={[
            {
              title: 'Reviews',
              url: `/${lang}/${defaultWorkspaceId}/reviews`,
              icon: IconListDetails
            },
            {
              title: 'Collect Forms',
              url: `/${lang}/${defaultWorkspaceId}/forms`,
              icon: IconDashboard
            },
            {
              title: 'Widgets',
              url: `/${lang}/${defaultWorkspaceId}/widgets`,
              icon: IconChartBar
            }
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
