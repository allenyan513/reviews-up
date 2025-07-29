import { ProductEntity } from '@reviewsup/api/products';

export async function fetchProductDetail(
  slug: string,
): Promise<ProductEntity | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/public/slug/${slug}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    return null;
  }
  return data as ProductEntity;
}
