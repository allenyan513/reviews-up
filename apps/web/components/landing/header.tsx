'use client';

import { Menu, X } from 'lucide-react';
import { useSelectedLayoutSegment } from 'next/navigation';
import * as React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@reviewsup/ui/button';
import { Logo } from './logo';
import { cn } from '@reviewsup/ui/lib/utils';
import { useState } from 'react';
import { BsGithub, BsCaretDown, BsPlus, BsPlusCircle } from 'react-icons/bs';
import { LanguageSwitcher } from '@/components/language-switcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@reviewsup/ui/dropdown-menu';

interface NavProps {
  lang?: string;
  websiteLogo?: string;
  websiteName?: string;
  githubLink?: string;
  appLink?: string;
  items?: {
    title: string;
    href: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    external?: boolean;
    children?: {
      title: string;
      href: string;
      external?: boolean;
      disabled?: boolean;
    }[];
  }[];
}

function MobileItems(props: NavProps) {
  return (
    <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 animate-in slide-in-from-bottom-80 md:hidden">
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {props.items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
                item.disabled && 'cursor-not-allowed opacity-60',
              )}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

function DesktopItems(props: NavProps) {
  const segment = useSelectedLayoutSegment();
  const [open, setOpen] = React.useState(false);

  return (
    <nav className="hidden gap-6 md:flex">
      {props.items?.map((item, index) => {
        const isActive = item.href.startsWith(`/${segment}`);
        const baseClasses = cn(
          'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-[1rem]',
          isActive ? 'text-foreground' : 'text-foreground/60',
          item.disabled && 'cursor-not-allowed opacity-60',
        );

        if (item.children && item.children.length > 0) {
          return (
            <DropdownMenu key={index}>
              <DropdownMenuTrigger asChild>
                <div className={cn(baseClasses, 'cursor-pointer')}>
                  {item.title}
                  <BsCaretDown className="text-sm ml-1 mt-1" />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="bottom" align="start" className="w-48">
                {item.children.map((child, childIndex) => (
                  <DropdownMenuItem
                    key={childIndex}
                    asChild={true}
                    disabled={item.disabled}
                  >
                    <Link
                      href={child.disabled ? '#' : child.href}
                      target={child.external ? '_blank' : undefined}
                      rel={child.external ? 'noreferrer' : undefined}
                      className="w-full cursor-pointer hover:bg-gray-100 px-4 py-2 text-sm"
                    >
                      {child.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <Link
            key={index}
            href={item.disabled ? '#' : item.href}
            className={baseClasses}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noreferrer' : undefined}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export function Header(props: NavProps) {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  return (
    <header className="fixed flex w-full items-center justify-center mx-auto z-50 bg-background/80  backdrop-blur">
      <div className="flex h-18 items-center justify-between p-4 max-w-7xl w-full">
        <div className="flex flex-row justify-between items-center gap-4 md:gap-10">
          <Logo
            websiteLogo={props.websiteLogo}
            websiteName={props.websiteName}
            className=""
            isBeta={false}
          />
          <Button
            className="space-x-2 md:hidden"
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          {showMobileMenu && props.items && <MobileItems items={props.items} />}
        </div>
        <div>
          {props.items?.length ? <DesktopItems items={props.items} /> : null}
        </div>
        <div className="flex gap-4 items-center">
          <LanguageSwitcher
            lang={props.lang || 'en'}
            className="hidden md:inline-flex"
          />
          <Link
            className="hidden md:inline-flex"
            href={props.githubLink || ''}
            target="_blank"
          >
            <BsGithub className="h-6 w-6" />
          </Link>
          <Link
            href={props.appLink || ''}
            className={cn(
              buttonVariants({ size: 'default' }),
              'rounded-md inline-flex hover:bg-red-500 hover:text-white transition-colors',
              'text-white bg-red-400',
            )}
          >
            <span className="">Sign in</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
