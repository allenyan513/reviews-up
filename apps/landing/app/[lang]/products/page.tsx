import { ProductList } from '@/modules/product/product-list';
import { Metadata } from 'next';
import { fetchProductList } from '@/actions/fetch-product-list';

export async function generateMetadata(props: {
  params: Promise<{
    lang: string;
  }>;
}): Promise<Metadata | null> {
  const { lang } = await props.params;
  const product = await fetchProductList();
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
  }>;
}) {
  return <ProductList params={props.params} />;
}
