import { fetchProductDetail } from '@/actions/fetch-product-detail';
import ProductDetail from '@/modules/product/product-detail';
import { Metadata } from 'next';

export async function generateMetadata(props: {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}): Promise<Metadata | null> {
  const { lang, slug } = await props.params;
  const product = await fetchProductDetail(slug);
  return {
    title: `${product.name}: ${product.description}`.substring(0, 60),
    description: `${product.name}: ${product.longDescription}.`.substring(
      0,
      160,
    ),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WWW_URL}/${lang}/products/${slug}`,
    },
  };
}

export default function Page(props: {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
  children: React.ReactNode;
}) {
  return <ProductDetail params={props.params} />;
}
