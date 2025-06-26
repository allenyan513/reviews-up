'use client';

import React, {useEffect, useRef, useState} from 'react';
import ReviewImportDialog from '@/modules/review/review-import-dialog';
import {useUserContext} from '@/context/UserProvider';
import {api} from '@/lib/api-client';
import {DataTable} from '@/modules/review/table/data-table';
import {Button} from '@/components/ui/button';
import {IconCode, IconTable} from '@tabler/icons-react';
import {useRouter} from 'next/navigation';
import {BiHide, BiInfoCircle, BiShow} from "react-icons/bi";
import {cn} from "@/lib/utils";


const statusOptions = [
  {
    name: 'All',
    value: '',
    icon: null
  },
  {
    name: 'Pending',
    value: 'pending',
    icon: <BiInfoCircle/>,
  },
  {
    name: 'Public',
    value: 'public',
    icon: <BiShow/>,
  },
  {
    name: 'Hidden',
    value: 'hidden',
    icon: <BiHide/>,
  },
];

export default function ReviewsPage() {
  const router = useRouter();
  const {defaultWorkspace} = useUserContext();
  const [totalServerRowCount, setTotalServerRowCount] = useState(0); // Optional: to display total count
  const [filterValue, setFilterValue] = useState<string>('');

  const fetchReviews = async (
    pageIndex: number,
    pageSize: number,
    sorting: any, // Use actual SortingState type if imported
    columnFilters: any, // Use actual ColumnFiltersState type if imported
  ) => {
    if (!defaultWorkspace) {
      return null;
    }
    // Construct your API endpoint based on pagination, sorting, and filters
    const params = new URLSearchParams();
    params.append('page', (pageIndex + 1).toString()); // Backend often expects 1-indexed pages
    params.append('limit', pageSize.toString());
    // Add sorting parameters
    if (sorting.length > 0) {
      params.append('sortBy', sorting[0].id);
      params.append('sortOrder', sorting[0].desc ? 'desc' : 'asc');
    }
    // Add filtering parameters
    columnFilters.forEach((filter: any) => {
      params.append(filter.id, filter.value);
    });
    const res = await api.review.getReviews({
      workspaceId: defaultWorkspace?.id || '',
      page: parseInt(params.get('page') || '1'),
      pageSize: parseInt(params.get('limit') || '10'),
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setTotalServerRowCount(res.meta.total); // Update total count if you need to display it
    return {
      data: res.items,
      pageCount: res.meta.total,
      totalRowCount: res.meta.total, // Pass totalRowCount if your pagination component uses it
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
          <Button
            className='hidden md:flex'
            onClick={() => {
              router.push(`/${defaultWorkspace?.id}/showcases`);
            }}
            size={'lg'}
            variant={'outline'}
          >
            <IconCode/>
            <span>Create Showcase</span>
          </Button>
          <Button
            className='hidden md:flex'
            onClick={() => {
              router.push(`/${defaultWorkspace?.id}/forms`);
            }}
            size={'lg'}
            variant={'outline'}
          >
            <IconTable/>
            <span>Create Collect Form</span>
          </Button>
          <ReviewImportDialog/>
        </div>
      </div>
      <div className='flex flex-col '>
        <div className="flex flex-row">
          {statusOptions.map((filter, index) => (
            <Button
              className={cn(
                'rounded-none ',
                index === 0 ? 'rounded-l-lg' : '',
                index === 3 ? 'rounded-r-lg' : '',
                filterValue === filter.value
                  ? 'bg-gray-100'
                  : 'bg-white',
              )}
              key={filter.value}
              variant={'outline'}
              onClick={() => {
                // table.getColumn('status')?.setFilterValue(filter.value);
                setFilterValue(filter.value);
              }}
            >
              {filter.icon && <span>{filter.icon}</span>}
              {filter.name}
            </Button>
          ))}
        </div>
        <DataTable
          fetchData={fetchReviews}
        />
      </div>
    </div>
  );
}
