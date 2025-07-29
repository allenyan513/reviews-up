'use client';
import { buttonVariants } from '@reviewsup/ui/button';
import Link from 'next/link';
import { BsGithub, BsLinkedin, BsTwitterX, BsEnvelope } from 'react-icons/bs';
import { I18nEntries } from '@/components/i18n-entries';
import { ProductCategory } from '@reviewsup/api/products';

const sources = [
  {
    title: 'Customers',
    url: '/customers',
  },
  {
    title: 'Features',
    url: '/features',
  },
  {
    title: 'Integrations',
    url: '/integrations',
  },
  {
    title: 'Pricing',
    url: '/pricing',
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

const compares = [
  {
    title: 'Reviewsup vs. Trustpilot',
    url: '/compare/reviewsup-vs-trustpilot',
  },
  {
    title: 'Reviewsup vs. Google Reviews',
    url: '/compare/reviewsup-vs-google-reviews',
  },
  {
    title: 'Reviewsup vs. Yotpo',
    url: '/compare/reviewsup-vs-yotpo',
  },
  {
    title: 'Reviewsup vs. Trustindex',
    url: '/compare/reviewsup-vs-trustindex',
  },
  {
    title: 'Reviewsup vs. Testimonial.to',
    url: '/compare/reviewsup-vs-testimonial-to',
  },
];

const resources = [
  {
    title: 'Pricing',
    url: '/pricing',
  },
  {
    title: 'About Us',
    url: '/about',
  },
  {
    title: 'Terms of Service',
    url: '/terms-of-service',
  },
  {
    title: 'Privacy Policy',
    url: '/privacy-policy',
  },
];

function FooterLinks(props: {
  title: string;
  links: { title: string; url: string; external?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-1 text-[16px]">
      <h2 className="font-semibold">{props.title}</h2>
      {props.links.map((link, index) => (
        <Link
          key={index}
          href={link.url}
          className="text-gray-500 hover:text-gray-600"
          target={link.external ? '_blank' : '_self'}
          {...(link.external ? { rel: 'noopener noreferrer' } : {})}
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
}

export function Footer(props: {
  builtBy: string;
  builtByLink: string;
  githubLink: string;
  twitterLink: string;
  linkedinLink: string;
  email: string;
}) {
  return (
    <footer className="flex flex-col gap-2 py-8 w-full px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:grid md:md:grid-cols-12 text-sm">
        <div className="flex flex-col gap-2 md:col-span-4">
          <h3 className="text-lg font-bold sm:inline-block text-red-400">
            Reviewsup.io
          </h3>
          <h4 className='w-full md:max-w-50'>Open Source Testimonials & Reviews Management System</h4>
          <div className="flex items-center">
            {(
              [
                { href: props.twitterLink, icon: <BsTwitterX /> },
                { href: props.linkedinLink, icon: <BsLinkedin /> },
                { href: props.githubLink, icon: <BsGithub /> },
                { href: props.email, icon: <BsEnvelope /> },
              ] as const
            ).map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:col-span-8">
          <div className="flex flex-col gap-4">
            <FooterLinks title="Products" links={sources} />
            <I18nEntries />
          </div>
          <div className="flex flex-col gap-4">
            <FooterLinks title="Compares" links={compares} />
            <FooterLinks title="Blogs" links={howTo} />
          </div>
          <div className="flex flex-col gap-4">
            <FooterLinks title="Resources" links={resources} />
          </div>
        </div>
      </div>
    </footer>
  );
}
