'use client';
import { buttonVariants } from '@reviewsup/ui/button';
import Link from 'next/link';
import { BsGithub, BsLinkedin, BsTwitterX } from 'react-icons/bs';
import { I18nEntries } from '@/components/i18n-entries';
import { ProductCategory } from '@reviewsup/api/products';

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

const howTo = [
  {
    title: 'How to embed reviews on Notion',
    url: `/how-to/notion`,
  },
  {
    title: 'How to embed reviews on WordPress',
    url: `/how-to/wordpress`,
  },
  {
    title: 'How to embed reviews on Wix',
    url: `/how-to/wix`,
  },
  {
    title: 'How to embed reviews on Webflow',
    url: `/how-to/webflow`,
  },
  {
    title: 'How to embed reviews on Shopify',
    url: `/how-to/shopify`,
  },
  {
    title: 'How to embed reviews on Squarespace',
    url: `/how-to/squarespace`,
  },
  {
    title: 'How to turn FB Messenger DMs into reviews',
    url: `/how-to/facebook-messenger`,
  },
  {
    title: 'How to turn Instagram Shoutouts on your website',
    url: `/how-to/instagram-shoutouts`,
  },
  {
    title: 'How to turn WhatsApp Messages into reviews',
    url: `/how-to/whatsapp-dms`,
  },
  {
    title: 'How to turn TikTok videos into reviews',
    url: `/how-to/tiktok-videos`,
  },
  {
    title: 'How to turn X (Twitter) posts into reviews',
    url: `/how-to/x-posts`,
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
    <footer className="flex flex-col gap-2 py-8 w-full px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 text-sm">
        <div className="flex flex-col gap-1">
          <h2 className="uppercase font-semibold">Products</h2>
          {sources.map((source, index) => (
            <Link
              key={index}
              href={source.url}
              className="text-gray-500 hover:text-gray-600"
              target={source.external ? '_blank' : '_self'}
              {...(source.external ? { rel: 'noopener noreferrer' } : {})}
            >
              {source.title}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="uppercase font-semibold">How to Use</h2>
          {howTo.map((source, index) => (
            <Link
              key={index}
              href={source.url}
              className="text-gray-500 hover:text-gray-600"
            >
              {source.title}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="uppercase font-semibold">Categories</h2>
          {Object.entries(ProductCategory).map(([key, value]) => (
            <Link
              key={key}
              href={'/categories/' + key}
              className="text-gray-500 hover:text-gray-600"
            >
              {value}
            </Link>
          ))}
        </div>
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
              key={index}
              href={link.href}
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
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
