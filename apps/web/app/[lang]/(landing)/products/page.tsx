import { ProductList } from '@/modules/product/product-list';
import { Metadata } from 'next';
import { ProductStatus } from '@reviewsup/api/products';

export async function generateMetadata(props: {
  params: Promise<{
    lang: string;
  }>;
}): Promise<Metadata | null> {
  const { lang } = await props.params;
  return {
    title: ` Top Products Launching Today`,
    description:
      'View all products here, you can filter products by categories and search.',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${lang}/products`,
    },
  };
}

export default async function Page(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = await props.params;
  return (
    <ProductList
      title={'Top Products Launching Today'}
      status={ProductStatus.listing}
      lang={lang}
      defaultTags={[]}
    />
  );
}
