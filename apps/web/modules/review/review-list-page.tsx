'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReviewImportDialog from '@/modules/review/review-import-dialog';
import { api } from '@/lib/api-client';
import { DataTable } from '@/components/data-table';
import { columns } from '@/modules/review/review-list-page-columns';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardRoot } from '@/components/dashboard/dashboard-root';

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
    return {
      data: res.items,
      pageCount: res.meta.pageCount,
      totalRowCount: res.meta.total,
    };
  };

  return (
    <DashboardRoot>
      <DashboardHeader
        title={'Reviews'}
        subtitle={'Organize the testimonials you have received or imported.'}
        buttons={<ReviewImportDialog />}
      />
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
    </DashboardRoot>
  );
}
