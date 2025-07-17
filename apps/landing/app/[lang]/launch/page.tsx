import { Hero } from '@/components/landing/hero';
import { FeatureGrid } from '@/components/landing/features';
import { PricingGrid } from '@/components/landing/pricing';
import { i18nMetadata } from '@/config/i18n-config';
import { Metadata } from 'next';
import { HowItWorks } from '@/components/landing/how-it-works';
import FAQ from '@/components/landing/faq';
import { hero3 } from '@/data/hero';
import { WidgetWrapper } from '@/components/landing/widget';
import { Badge } from '@/components/badge';
import { useTranslate } from '@/locales/dictionaries';
import { getWidgetData } from '@/data/widgets';
import { featureData } from '@/data/features';
import { pricingData } from '@/data/pricings';
import { faqData } from '@/data/faqs';
import { CollectingForm } from '@/components/landing/collecting-form';
import { collectingFormData } from '@/data/collecting-form';

function getPageData(lang: string) {
  return {
    title: 'Launch Confidently \nwith Real User Reviews',
    description:
    'Submit your product to the Reviewsup.io community — where active users are eager to give authentic feedback and boost your launch success.',
    keywords: ['open source reviews'],
    icons: {
      icon: '/favicon.ico',
    },
    alternates: {
      canonical: `https://reviewsup.io/${lang}`,
    },
    primaryCtaText: 'Free Launch 🚀',
    primaryCtaLink: `${process.env.NEXT_PUBLIC_APP_URL}/launch`,
  };
}

export async function generateMetadata(props: {
  params: Promise<{
    lang: string;
  }>;
}): Promise<Metadata> {
  const { lang } = await props.params;
  const t = useTranslate(lang);
  const metadata = getPageData(lang);
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    icons: metadata.icons,
    alternates: metadata.alternates,
  };
}

export async function generateStaticParams() {
  return i18nMetadata;
}

export default async function LandingPage(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = await props.params;
  const t = await useTranslate(lang);
  const pageData = getPageData(lang);
  const widgetData = getWidgetData();

  return (
    <div className="flex flex-col w-full items-center gap-8 md:gap-12">
      <Hero
        capsuleText={'100% Free'}
        capsuleLink={''}
        title={pageData.title}
        subtitle={pageData.description}
        primaryCtaText={pageData.primaryCtaText}
        primaryCtaLink={pageData.primaryCtaLink}
        secondaryCtaText={''}
        secondaryCtaLink={''}
        credits={<></>}
      />


      <div id={'faqs'} />
      <FAQ data={faqData} />

      <div id="badges" className="py-8">
        <Badge />
      </div>
    </div>
  );
}
