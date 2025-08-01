import { Metadata } from 'next';
import { ProductCategory, ProductStatus } from '@reviewsup/api/products';
import { CategoryGrid } from '@/modules/product/category-grid';

export async function generateMetadata(props: {
  params: Promise<{
    lang: string;
  }>;
}): Promise<Metadata | null> {
  const { lang } = await props.params;
  const categoriesCount = Object.keys(ProductCategory).length;
  return {
    title: `${categoriesCount}+ Product Categories`,
    description:
      'Explore various product categories. You can filter products by categories and search for specific items.',
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
  return <CategoryGrid status={ProductStatus.listing} lang={lang} />;
}
