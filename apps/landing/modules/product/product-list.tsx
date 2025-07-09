'use client';
import React, { use, useEffect, useState } from 'react';
import {
  ProductCategory,
  ProductEntity,
  ProductStatus,
  findAllRequestSchema,
} from '@reviewsup/api/products';
import { Input } from '@reviewsup/ui/input';
import { Checkbox } from '@reviewsup/ui/checkbox';
import { Label } from '@reviewsup/ui/label';
import { ProductItemView } from './product-item';
import { fetchProductList } from '@/actions/fetch-product-list';

export function ProductList(props: {
  params: Promise<{
    lang: string;
  }>;
}) {
  const { lang } = use(props.params);
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [originalProducts, setOriginalProducts] = useState<ProductEntity[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProductList(page, pageSize, categories)
      .then((response) => {
        setProducts(response);
        setOriginalProducts(response);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, [categories]);

  useEffect(() => {
    if (search.trim() === '') {
      setProducts(originalProducts);
    } else {
      setProducts(
        originalProducts.filter((product) =>
          product?.name?.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, originalProducts]);

  return (
    <div className="flex flex-col pt-32 px-32 gap-16">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-5xl font-bold">
          {/*  发现那些需要意见反馈的应用*/}
          Join the Feedback Community
        </h1>
        <h2 className="text-xl text-gray-600 max-w-5xl mx-auto">
          Support developers by trying out apps and sharing your reviews. Together, we build better products.
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-2 flex flex-col gap-4">
          <h2>Filter Products</h2>
          <Input
            type="text"
            placeholder="Search products..."
            className="mb-4"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <h2>Categories</h2>
          <div className="flex flex-col gap-2">
            {Object.entries(ProductCategory).map(([key, value]) => (
              <div
                className="flex flex-row items-center gap-2 bg-gray-50 p-3 rounded-md hover:bg-gray-100"
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
        <div className="col-span-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start gap-4">
          {products &&
            products.map((product) => (
              <ProductItemView key={product.id} product={product} />
            ))}
        </div>
      </div>
    </div>
  );
}
