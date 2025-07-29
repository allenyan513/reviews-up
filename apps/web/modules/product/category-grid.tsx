'use client';
import React, { use, useEffect, useState } from 'react';
import { ProductCategory, ProductEntity } from '@reviewsup/api/products';
import { Input } from '@reviewsup/ui/input';
import { Checkbox } from '@reviewsup/ui/checkbox';
import { Label } from '@reviewsup/ui/label';
import { fetchProductList } from '@/actions/fetch-product-list';
import { ProductGridItemView } from '@/modules/product/product-grid-item';
import { Button } from '@reviewsup/ui/button';
import { cn } from '@reviewsup/ui/lib/utils';

export function CategoryGrid(props: { status: string; lang: string }) {
  const { lang, status } = props;
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [originalProducts, setOriginalProducts] = useState<ProductEntity[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [search, setSearch] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    fetchProductList(status, page, pageSize, tags)
      .then((response) => {
        setProducts(response.items);
        setOriginalProducts(response.items);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, [tags]);

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
    <div className="flex flex-col py-24 px-4 md:px-32">
      <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
        <div className="hidden md:col-span-2 md:flex md:flex-col gap-4">
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
                      setTags((prev) => [...prev, key]);
                    } else {
                      setTags((prev) =>
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
        <div className="flex flex-col md:col-span-10 gap-4 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-start gap-4">
            {products &&
              products.map((product) => (
                <ProductGridItemView key={product.id} product={product} />
              ))}
          </div>
          <Button
            className={cn(
              'max-w-md mt-8',
              products.length === 0 ? 'hidden' : 'block',
            )}
            variant="outline"
            onClick={() => {
              setPage((prev) => prev + 1);
              fetchProductList(status, page + 1, pageSize, tags)
                .then((response) => {
                  setProducts((prev) => [...prev, ...response.items]);
                  setOriginalProducts((prev) => [...prev, ...response.items]);
                })
                .catch((error) => {
                  console.error('Error fetching more products:', error);
                });
            }}
          >
            Load More
          </Button>
        </div>
      </div>
    </div>
  );
}
