'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { api } from '@/lib/api-client';
import { useSession, useUserContext } from '@/context/UserProvider';
import {
  ProductCategory,
  ProductEntity,
  ProductStatus,
  findAllRequestSchema,
} from '@reviewsup/api/products';
import { ReviewEntity } from '@reviewsup/api/reviews';
import { Input } from '@reviewsup/ui/input';
import { Checkbox } from '@reviewsup/ui/checkbox';
import { Label } from '@reviewsup/ui/label';
import { ProductItemView } from '@/modules/promotion/promotion-product-item-view';

export function PromotionAppsToReview(props: {
  params: Promise<{
    lang: string;
    workspaceId: string;
  }>;
}) {
  const { lang, workspaceId } = use(props.params);
  const { user } = useSession();
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [submittedReviews, setSubmittedReviews] = useState<ReviewEntity[]>([]);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  const fetchData = () => {
    if (!workspaceId) {
      return null;
    }
    const validatedRequest = findAllRequestSchema.parse({
      status: [ProductStatus.pendingForReceive, ProductStatus.listing],
      page: page,
      pageSize: pageSize,
      search: search,
      categories: categories,
    });
    api.product
      .findAll(validatedRequest)
      .then((response) => {
        setProducts(response);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  };

  useEffect(() => {
    fetchData();

    if (user) {
      api.review
        .findAllByReviewerId(user.id)
        .then((response) => {
          setSubmittedReviews(response);
          console.log('Submitted reviews:', response);
        })
        .catch((error) => {
          console.error('Error fetching reviews:', error);
        });
    }
  }, [workspaceId, user]);

  useEffect(() => {
    console.log('params changed:', search, categories);
    fetchData()
  }, [search, categories]);

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center mb-8">
        <div>
          <Link
            href={`/${lang}/${workspaceId}/forms`}
            className="flex flex-row items-center gap-2 "
          >
            <h1 className="text-3xl font-semibold text-gray-900 line-clamp-1">
              Apps to Review
            </h1>
          </Link>
          <p className="mt-1 text-gray-600 hidden md:flex">
            Review other products to receive feedback on your own.
          </p>
        </div>
        <div className={'flex flex-row gap-1 md:gap-2'}></div>
      </div>
      <div className="grid grid-cols-12 gap-8">
        {/* 搜索，筛选 分类，*/}
        <div className="col-span-2 flex flex-col gap-4">
          <h2>Filter Products</h2>
          <Input
            type="text"
            placeholder="Search products..."
            className="mb-4"
            value={search}
            onChange={(e) => {
              const query = e.target.value.toLowerCase();
              setSearch(query);
            }}
          />

          <h2>Categories</h2>
          <div className="flex flex-col gap-2">
            {Object.entries(ProductCategory).map(([key, value]) => (
              <div
                className="flex flex-row items-center gap-2 bg-gray-50 p-3 rounded-md hover:bg-gray-100 cursor-pointer"
                key={key}
              >
                <Checkbox
                  key={key}
                  id={key}
                  className="border-gray-400"
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setCategories((prev) => [...prev, key]);
                    } else {
                      setCategories((prev) =>
                        prev.filter((category) => category !== key),
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={key}
                  className="text-sm w-full cursor-pointer font-normal"
                >
                  {/*capitalize the first letter of each word*/}
                  {value
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/*  产品grid*/}
        <div className="col-span-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
          {products &&
            products.map((product) => (
              <ProductItemView
                key={product.id}
                product={product}
                user={user}
                submittedReviews={submittedReviews}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
