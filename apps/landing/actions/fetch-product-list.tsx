import { findAllRequestSchema, ProductStatus } from '@reviewsup/api/products';

export async function fetchProductList(
  page: number = 1,
  pageSize: number = 10,
  categories: string[] = [],
) {
  const validatedRequest = findAllRequestSchema.parse({
    status: [ProductStatus.listing],
    page: page,
    pageSize: pageSize,
    search: undefined,
    categories: categories,
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/public/list`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedRequest),
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  return await response.json();
}
