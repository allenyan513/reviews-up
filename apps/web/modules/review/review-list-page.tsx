'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReviewImportDialog from '@/modules/review/review-import-dialog';
import { useUserContext } from '@/context/UserProvider';
import { api } from '@/lib/api-client';
import { DataTable } from '@/components/data-table';
import { columns } from '@/modules/review/review-list-page-columns';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';

export default function ReviewsPage(props: {
  lang: string;
  productId: string;
  status: string | undefined;
  mode: 'productId' | 'reviewerId';
}) {
  const { lang, productId, status } = props;
  const fetchReviews = async (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState,
    filters: ColumnFiltersState,
  ) => {
    if (!productId) {
      throw new Error('Product ID is required to fetch reviews');
    }
    const res = await api.review.getReviews({
      page: pageIndex + 1,
      pageSize: pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...(props.mode === 'productId' && {
        productId: productId,
      }),
    });
    console.log(res);
    return {
      data: res.items,
      pageCount: res.meta.pageCount,
      totalRowCount: res.meta.total,
    };
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">Reviews</h1>
          <p className="hidden md:flex text-gray-600">
            Organize the testimonials you have received or imported.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ReviewImportDialog />
        </div>
      </div>
      <DataTable
        fetchData={fetchReviews}
        columns={columns}
        config={{
          mode: props.mode,
        }}
        defaultColumnFilters={
          status === 'all' ? [] : [{ id: 'status', value: status }]
        }
      />
    </div>
  );
}
