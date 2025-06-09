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
import { cn } from '@/lib/utils';

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
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                'cursor-pointer flex flex-row gap-2 w-full items-center justify-start h-12 rounded px-4 font-semibold',
                item.active
                  ? 'bg-red-100 text-red-400'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {item.icon && <item.icon />}
              <span className={'text-[14px]'}>{item.title}</span>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
