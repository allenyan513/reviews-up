import type { Metadata } from 'next';
import '@/app/globals.css';
import { Open_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

const openSans = Open_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title:
    'ReviewsUp.io - An Open-Source Review and Testimonials Management Platform',
  description:
    'Manage your reviews and testimonials with ease using ReviewsUp.io, the open-source platform designed for businesses of all sizes.',
};

export default async function RootLayout(props: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await props.params;
  return (
    <html lang={lang} translate="no">
      <body className={openSans.className}>
        {props.children}
        <Analytics />
      </body>
    </html>
  );
}
