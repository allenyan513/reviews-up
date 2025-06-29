'use client';

import { Menu, X } from 'lucide-react';
import { useSelectedLayoutSegment } from 'next/navigation';
import * as React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@repo/ui/button';
import { Logo } from './logo';
import { cn } from '@repo/ui/lib/utils';
import { useState } from 'react';
import { BsGithub } from 'react-icons/bs';

interface NavProps {
  websiteLogo?: string;
  websiteName?: string;
  githubLink?: string;
  appLink?: string;
  items?: {
    title: string;
    href: string;
    disabled?: boolean;
    external?: boolean;
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

  return (
    <nav className="hidden gap-6 md:flex">
      {props.items?.map((item, index) => (
        <Link
          key={index}
          href={item.disabled ? '#' : item.href}
          className={cn(
            'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
            item.href.startsWith(`/${segment}`)
              ? 'text-foreground'
              : 'text-foreground/60',
            item.disabled && 'cursor-not-allowed opacity-80',
          )}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noreferrer' : undefined}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export function Header(props: NavProps) {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  return (
    <header className="fixed w-full z-50 bg-background/80 px-4 md:px-8 backdrop-blur">
      <div className="flex h-18 items-center justify-between py-4">
        <div className="flex items-center gap-4 md:gap-10">
          <Logo
            websiteLogo={props.websiteLogo}
            websiteName={props.websiteName}
            className=""
            isBeta={true}
          />
          {props.items?.length ? <DesktopItems items={props.items} /> : null}
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
          {/*<Logo className="md:hidden" />*/}

          {showMobileMenu && props.items && <MobileItems items={props.items} />}
        </div>
        <div className="flex gap-4 items-center">
          <Link href={props.githubLink || ''} target="_blank">
            <BsGithub className="h-6 w-6" />
          </Link>
          <Link
            href={props.appLink || ''}
            target="_blank"
            className={cn(buttonVariants({ size: 'lg' }),
              'rounded-full hidden md:inline-flex'
              )}
          >
           Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
