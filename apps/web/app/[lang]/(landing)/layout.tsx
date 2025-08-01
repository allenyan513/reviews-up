import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export default async function RootLayout(props: {
  params: Promise<{
    lang: string;
  }>;
  children: React.ReactNode;
}) {
  const { lang } = await props.params;
  return (
    <>
      <Header
        lang={lang}
        websiteLogo={'/img/logo-32.png'}
        websiteName={'Reviewsup.io'}
        githubLink="https://github.com/allenyan513/reviewsup.io"
        appLink={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}
        items={[
          { title: 'Customers', href: '/#customers' },
          { title: 'Features', href: '/#features' },
          { title: 'Integrations', href: '/#integrations' },
          { title: 'Pricing', href: '/#pricing' },
          // { title: 'Products', href: `/products` },
          // { title: 'Categories', href: `/categories` },
        ]}
      />
      <main className="flex-1 w-full">{props.children}</main>
      <Footer
        builtBy="Reviewsup.io"
        builtByLink={process.env.NEXT_PUBLIC_APP_URL as string}
        githubLink="https://github.com/allenyan513/reviewsup.io"
        twitterLink="https://x.com/alinlinlink"
        linkedinLink="https://www.linkedin.com/in/ligangyan/"
        email={'mailto:support@reviewsup.io'}
      />
    </>
  );
}
