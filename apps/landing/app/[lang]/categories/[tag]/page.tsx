import { ProductList } from '@/modules/product/product-list';
import { Metadata } from 'next';
import { ProductCategory, ProductStatus } from '@reviewsup/api/products';

export async function generateMetadata(props: {
  params: Promise<{
    lang: string;
    tag: string;
  }>;
}): Promise<Metadata | null> {
  const { lang } = await props.params;
  return {
    title: `Product List`,
    description:
      'View all products here, you can filter products by categories and search.',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WWW_URL}/${lang}/products`,
    },
  };
}

export default async function Page(props: {
  params: Promise<{
    lang: string;
    tag: string;
  }>;
}) {
  const { lang, tag } = await props.params;
  const categoryValue = ProductCategory[tag as keyof typeof ProductCategory]
  return (
    <ProductList
      title={`Top ${categoryValue} Products`}
      status={ProductStatus.listing}
      lang={lang}
      defaultTags={[tag]}
    />
  );
}
