'use client';

import React, { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api-client';
import { DataTable } from '@/components/data-table';
import { columns } from '@/modules/product/explore-columns';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { findAllRequestSchema, ProductStatus } from '@reviewsup/api/products';

export default function ExplorePage(props: {
  lang: string;
  productId: string;
}) {
  const { lang, productId } = props;
  const fetchData = async (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState,
    filters: ColumnFiltersState,
  ) => {
    const validatedRequest = findAllRequestSchema.parse({
      status: [ProductStatus.pendingForReceive, ProductStatus.listing],
      page: pageIndex + 1,
      pageSize: pageSize,
      search: undefined,
      categories: undefined,
    });
    const res = await api.product.findAll(validatedRequest);
    console.log(res);
    return {
      data: res.items,
      pageCount: 1,
      totalRowCount: 10,
    };
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">
            Explore Products
          </h1>
          <p className="hidden md:flex text-gray-600">
            Discover products that need your feedback. Support developers by
            trying out apps and sharing your reviews. Together, we build better
            products.
          </p>
        </div>
        <div className="flex items-center space-x-4"></div>
      </div>
      <DataTable fetchData={fetchData} columns={columns} config={{}} />
    </div>
  );
}
