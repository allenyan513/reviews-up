'use client';

import { IconCirclePlusFilled, IconMail, type Icon } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Workspace } from '@repo/api/workspaces/entities/workspace.entity';
import WorkspaceChangeButton from '@/components/biz/workspace-change-button';

export function NavMain(props: {
  workspace: Workspace | null | undefined;
  items: {
    title: string;
    url: string;
    icon?: Icon;
    active?: boolean;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <WorkspaceChangeButton />
        <SidebarMenu>
          {props.items.map((item) => (
            <SidebarMenuItem className="cursor-pointer" key={item.title}>
              <SidebarMenuButton
                isActive={item.active}
                size={'lg'}
                tooltip={item.title}
              >
                <Link
                  href={item.url}
                  className="cursor-pointer flex flex-row gap-2 w-full items-center justify-start"
                >
                  {item.icon && <item.icon />}
                  <span className={'text-[14px]'}>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
