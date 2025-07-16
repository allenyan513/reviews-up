import { Open_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { cn } from '@reviewsup/ui/lib/utils';
import { GoogleAnalytics } from '@next/third-parties/google';
import { IconCirclesRelation } from '@tabler/icons-react';
import { BiShare } from 'react-icons/bi';
import { BsLink } from 'react-icons/bs';

const openSans = Open_Sans({
  subsets: ['latin'],
});

export default async function RootLayout(props: {
  params: Promise<{
    lang: string;
  }>;
  children: React.ReactNode;
}) {
  const { lang } = await props.params;
  return (
    <html lang={lang}>
      <body
        className={cn(
          openSans.className,
          'flex min-h-screen flex-col items-center w-full',
        )}
      >
        <Header
          lang={lang}
          websiteLogo={'/img/logo-32.png'}
          websiteName={'Reviewsup.io'}
          githubLink="https://github.com/allenyan513/reviewsup.io"
          appLink={process.env.NEXT_PUBLIC_APP_URL as string}
          launchLink={`${process.env.NEXT_PUBLIC_APP_URL}/launch`}
          items={[
            { title: 'Home', href: '/' },
            {
              title: 'Community',
              href: `/products`,
              external: false,
            },
            { title: 'Widget', href: '/#widget' },
            { title: 'Form', href: '/#form' },
            { title: 'Features', href: '/#features' },
            { title: 'FAQ', href: '/#faq' },
            {
              title: 'Documents',
              href: `${process.env.NEXT_PUBLIC_DOCS_URL}/docs`,
              external: true,
            },
            {
              title: 'Blog',
              href: `${process.env.NEXT_PUBLIC_DOCS_URL}/blog`,
              external: true,
            },
          ]}
        />
        <main className="flex-1">{props.children}</main>
        <Footer
          builtBy="Reviewsup.io"
          builtByLink={process.env.NEXT_PUBLIC_APP_URL as string}
          githubLink="https://github.com/allenyan513/reviewsup.io"
          twitterLink="https://x.com/alinlinlink"
          linkedinLink="https://www.linkedin.com/in/ligangyan/"
        />
      </body>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics
          gaId={`${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
        />
      )}
    </html>
  );
}
