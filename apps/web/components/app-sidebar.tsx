'use client';

import * as React from 'react';
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
  IconSettings,
  IconStar,
  IconCode,
  IconTable,
  IconUser,

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
import { usePathname } from 'next/navigation';
import { useUserContext } from '@/context/UserProvider';

const data = {
  title: 'ReviewUp',
  navSecondary: [
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
              icon: IconStar,
              active: path.includes('/reviews')
            },
            {
              title: 'Showcases',
              url: `/${lang}/${defaultWorkspace?.id}/showcases`,
              icon: IconCode,
              active: path.includes('/showcases')
            },
            {
              title: 'Collect Forms',
              url: `/${lang}/${defaultWorkspace?.id}/forms`,
              icon: IconTable,
              active: path.includes('/forms')
            },
            {
              title: 'Settings',
              url: `/${lang}/settings`,
              icon: IconSettings,
              active: path.includes('/settings')
            },
            {
              title: 'Account',
              url: `/${lang}/account`,
              icon: IconUser,
              active: path.includes('/account')
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
