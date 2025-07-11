'use client';

import { IconCirclePlusFilled, IconMail, type Icon } from '@tabler/icons-react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { WorkspaceEntity } from '@reviewsup/api/workspace';
import { WorkspaceSwitchButton } from '@/modules/workspace/workspace-switch-button';
import { cn } from '@/lib/utils';

interface NavMainItem {
  title: string;
  url: string;
  icon?: Icon;
  active?: boolean;
  children?: NavMainItem[];
}

export function NavMain(props: {
  workspace: WorkspaceEntity | null | undefined;
  items: NavMainItem[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <WorkspaceSwitchButton />
        <SidebarMenu>
          {props.items.map((item) => (
            <div key={item.title} className="w-full">
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  'cursor-pointer flex flex-col gap-2 w-full items-start justify-center rounded px-4 font-semibold',
                  item.active
                    ? 'bg-red-100 text-red-400'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <div className="flex flex-row items-center gap-2 h-12">
                  {item.icon && <item.icon />}
                  <span className={'text-[14px]'}>{item.title}</span>
                </div>
              </Link>
              {item.children && item.children.length > 0 && (
                <div className="flex flex-col gap-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.title}
                      href={child.url}
                      className={cn(
                        'cursor-pointer flex flex-row items-center gap-2 h-10 px-8 rounded font-semibold',
                        child.active
                          ? 'text-red-400 bg-red-100'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      {child.icon && <child.icon />}
                      <span className={'text-[14px]'}>{child.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
