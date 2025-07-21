'use client';
import React, { use, useEffect, useState } from 'react';
import { ProductCategory, ProductEntity } from '@reviewsup/api/products';
import { fetchProductList } from '@/actions/fetch-product-list';
import { ProductListItemView } from '@/modules/product/product-list-item';
import Link from 'next/link';
import { Button } from '@reviewsup/ui/button';
import { cn } from '@reviewsup/ui/lib/utils';

export function ProductList(props: {
  title: string;
  lang: string;
  status: string;
  defaultTags?: string[];
}) {
  const { lang, status, defaultTags = [], title } = props;
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadProducts = async (pageToLoad: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await fetchProductList(
        status,
        pageToLoad,
        pageSize,
        tags,
      );
      setProducts((prev) => [...prev, ...response.items]);
      if (response.items.length < pageSize) {
        setHasMore(false); // 没有更多了
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // 初次加载
    loadProducts(1);
  }, [status, pageSize, JSON.stringify(tags)]); // JSON.stringify(tags) 防止 array 依赖不触发

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadProducts(nextPage);
  };

  // useEffect(() => {
  //   fetchProductList(status, page, pageSize, tags)
  //     .then((response) => {
  //       setProducts((prev) => [...prev, ...response.items]);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching products:', error);
  //     });
  // }, [status, page, pageSize, tags]);

  return (
    //  <div className="lg:grid lg:grid-cols-12 flex flex-col gap-4 py-24 w-full lg:w-7xl mx-auto">
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 py-24 px-4 lg:px-48">
      <div className="flex flex-col lg:col-span-9 gap-4">
        <h1 className="text-2xl font-semibold px-4">
          {/*Top Products Launching Today*/}
          {title ? title : 'Top Products'}
        </h1>
        <div className="flex flex-col items-center">
          {products &&
            products.map((product, index) => (
              <ProductListItemView
                key={product.id}
                index={index}
                product={product}
              />
            ))}

          {hasMore && (
            <Button
              className={cn('max-w-md mt-8')}
              variant="outline"
              onClick={handleLoadMore}
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          )}
        </div>
      </div>
      <div className="hidden lg:col-span-3 lg:flex lg:flex-col gap-4">
        <h2>Categories</h2>
        <div className="flex flex-col gap-2 text-sm text-gray-700">
          {Object.entries(ProductCategory).map(([key, value]) => (
            <Link
              key={key}
              href={`/categories/${key}`}
              className="flex flex-row items-center gap-2  hover:text-gray-900 hover:underline "
            >
              {value}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
