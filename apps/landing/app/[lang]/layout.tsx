import { Open_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { cn } from '@/lib/utils';

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
      <body className={cn(openSans.className, 'flex min-h-screen flex-col items-center w-full')}>
        <Header
          websiteName={'ReviewUp'}
          githubLink="https://github.com/allenyan513/ReviewsUp"
          appLink="https://app.reviewup.com"
          items={[
            { title: 'Home', href: '/' },
            { title: 'Features', href: '/#features' },
            { title: 'Pricing', href: '/#pricing' },
          ]}
        />
        <main className="flex-1">{props.children}</main>
        <Footer
          builtBy="Stack Auth"
          builtByLink="https://stack-auth.com/"
          githubLink="https://github.com/stack-auth/stack-template"
          twitterLink="https://twitter.com/stack_auth"
          linkedinLink="linkedin.com/company/stack-auth"
        />
      </body>
    </html>
  );
}
