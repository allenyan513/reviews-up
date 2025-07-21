'use client';
import { buttonVariants } from '@reviewsup/ui/button';
import Link from 'next/link';
import { BsGithub, BsLinkedin, BsTwitterX } from 'react-icons/bs';
import { I18nEntries } from '@/components/i18n-entries';

const sources = [
  {
    title: 'Blog',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/blog`,
    external: true,
  },
  {
    title: 'Documents',
    url: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs`,
    external: true,
  },
  {
    title: 'Launch',
    url: '/launch',
    external: false,
  },
  {
    title: 'Products',
    url: '/products',
    external: false,
  },
];

export function Footer(props: {
  builtBy: string;
  builtByLink: string;
  githubLink: string;
  twitterLink: string;
  linkedinLink: string;
}) {
  return (
    <footer className="px-4 flex flex-col gap-2 py-8  w-full md:max-w-5xl">
      <div className="flex flex-row items-center gap-2">
        {sources.map((source, index) => (
          <Link
            href={source.url}
            className="text-sm text-gray-500 hover:text-gray-600"
            target={source.external ? '_blank' : '_self'}
            {...(source.external ? { rel: 'noopener noreferrer' } : {})}
          >
            {source.title}
          </Link>
        ))}
      </div>
      <I18nEntries className="" />
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <a
              href={props.builtByLink}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {props.builtBy}
            </a>
            . The source code is available on{' '}
            <a
              href={props.githubLink}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="flex items-center space-x-1">
          {(
            [
              { href: props.twitterLink, icon: <BsTwitterX /> },
              { href: props.linkedinLink, icon: <BsLinkedin /> },
              { href: props.githubLink, icon: <BsGithub /> },
            ] as const
          ).map((link, index) => (
            <Link
              href={link.href}
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              key={index}
            >
              {/*<link.icon className="h-6 w-6" />*/}
              {link.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
