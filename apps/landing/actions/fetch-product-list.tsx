import {
  findAllRequestSchema,
  ProductEntity,
  ProductStatus,
} from '@reviewsup/api/products';
import { PaginateResponse } from '@reviewsup/api/common';

export async function fetchProductList(
  status: string,
  page: number = 1,
  pageSize: number = 10,
  categories: string[] = [],
): Promise<PaginateResponse<ProductEntity>> {
  const validatedRequest = findAllRequestSchema.parse({
    status: [status],
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
