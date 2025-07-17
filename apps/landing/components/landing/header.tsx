'use client';

import { Menu, X } from 'lucide-react';
import { useSelectedLayoutSegment } from 'next/navigation';
import * as React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@reviewsup/ui/button';
import { Logo } from './logo';
import { cn } from '@reviewsup/ui/lib/utils';
import { useState } from 'react';
import { BsGithub, BsCaretDown } from 'react-icons/bs';
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
  launchLink?: string;
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
          'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
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

        // return (
        //   <Link
        //     key={index}
        //     href={item.disabled ? '#' : item.href}
        //     className={cn(
        //       'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
        //       item.href.startsWith(`/${segment}`)
        //         ? 'text-foreground'
        //         : 'text-foreground/60',
        //       item.disabled && 'cursor-not-allowed opacity-80',
        //     )}
        //     target={item.external ? '_blank' : undefined}
        //     rel={item.external ? 'noreferrer' : undefined}
        //   >
        //     {item.icon && <span className="mr-2">{item.icon}</span>}
        //     {item.title}
        //
        //     {item.children && item.children.length > 0 && (
        //       <span className="ml-2 text-xs text-gray-500">▼</span>
        //     )}
        //     {item.children && item.children.length > 0 && (
        //       <div className="absolute left-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md">
        //         <ul className="p-2">
        //           {item.children.map((child, childIndex) => (
        //             <li key={childIndex}>
        //               <Link
        //                 href={child.disabled ? '#' : child.href}
        //                 className={cn(
        //                   'block px-4 py-2 text-sm hover:bg-gray-100',
        //                   child.disabled && 'cursor-not-allowed opacity-60',
        //                 )}
        //                 target={child.external ? '_blank' : undefined}
        //                 rel={child.external ? 'noreferrer' : undefined}
        //               >
        //                 {child.title}
        //               </Link>
        //             </li>
        //           ))}
        //         </ul>
        //       </div>
        //     )}
        //   </Link>
        // );
      })}
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
          <LanguageSwitcher lang={props.lang || 'en'} />
          <Link href={props.githubLink || ''} target="_blank">
            <BsGithub className="h-6 w-6" />
          </Link>
          {/*<Link*/}
          {/*  href={props.launchLink || ''}*/}
          {/*  target="_blank"*/}
          {/*  className={cn(*/}
          {/*    buttonVariants({ size: 'lg' }),*/}
          {/*    'rounded-full hidden md:inline-flex',*/}
          {/*    'text-black bg-white border ',*/}
          {/*  )}*/}
          {/*>*/}
          {/*  Free Launch*/}
          {/*</Link>*/}
          <Link
            href={props.appLink || ''}
            target="_blank"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'rounded-full hidden md:inline-flex',
              'text-white bg-red-400',
            )}
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
