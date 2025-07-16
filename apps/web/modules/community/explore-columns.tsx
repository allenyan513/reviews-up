'use client';

import { ColumnDef, useReactTable } from '@tanstack/react-table';
import { ReviewEntity, ReviewMediaEntity } from '@reviewsup/api/reviews';
import React from 'react';
import { BsCameraVideo, BsFilter, BsImage, BsSortDown } from 'react-icons/bs';
import { BiSort, BiFilterAlt, BiSortAlt2 } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating, StarRatingServer } from '@reviewsup/embed-react';
import { api } from '@/lib/api-client';
import { $Enums } from '@reviewsup/database/generated/client';
import ReviewStatus = $Enums.ReviewStatus;
import toast from 'react-hot-toast';
import {
  BiHide,
  BiInfoCircle,
  BiListCheck,
  BiShow,
  BiTrash,
} from 'react-icons/bi';
import ReviewLookupDialog from '@/modules/review/review-lookup-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toLocalDateString } from '@/lib/utils';
import { cn } from '@reviewsup/ui/lib/utils';
import { ReviewItemSource2 } from '@reviewsup/embed-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductEntity, ProductStatus } from '@reviewsup/api/products';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function columns(setData: any): ColumnDef<any>[] {
  return [
    {
      id: 'product',
      header: 'Product',
      cell: ({ row }) => {
        const product = row.original as ProductEntity;
        console.log(product);
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={product.icon} alt={product.name} />
              <AvatarFallback>{product?.name?.[0] || 'P'}</AvatarFallback>
            </Avatar>
            <span>{product.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => {
        const description = row.getValue('description') as string;
        const category = row.getValue('category') as string;
        return (
          <div className="text-sm text-gray-700 line-clamp-2 max-w-md whitespace-break-spaces">
            {description || 'No description available'}
          </div>
        );
      },
    },
    // {
    //   id: 'user',
    //   header: 'User',
    //   cell: ({ row }) => {
    //     const description = row.getValue('description') as string;
    //     const category = row.getValue('category') as string;
    //     return (
    //       <div className="text-sm text-gray-700 line-clamp-2 max-w-md whitespace-break-spaces">
    //         {description || 'No description available'}
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: 'category',
      header: 'Category',
      // cell: ({ row }) => {
      //   const description = row.getValue('description') as string;
      //   return (
      //     <div className="text-sm text-gray-700 line-clamp-2 max-w-md whitespace-break-spaces">
      //       {description || 'No description available'}
      //     </div>
      //   );
      // }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as ReviewStatus;
        return (
          <span
            className={cn(
              'px-2 py-1 rounded text-xs font-semibold',
              status === ProductStatus.listing
                ? 'bg-green-100 text-green-800'
                : status === ProductStatus.pendingForReceive
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800',
            )}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: 'review',
      header: 'Reviews',
      accessorFn: (row) => ({
        reviewCount: row.reviewCount,
        reviewRating: row.reviewRating,
        reviewRatingStr: row.reviewRatingStr,
      }),
      cell: ({ row, getValue }) => {
        const { reviewCount, reviewRating, reviewRatingStr } = getValue<{
          reviewCount: number;
          reviewRating: number;
          reviewRatingStr: string;
        }>();
        return (
          <div className="flex flex-col items-start gap-2">
            <span className="text-sm text-gray-700">
              {reviewCount} {reviewCount === 1 ? 'Review' : 'Reviews'}
            </span>

            <StarRatingServer
              value={reviewRating}
              size="sm"
              className="text-yellow-500"
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => {
        return (
          <Button
            variant={'ghost'}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <span>{toLocalDateString(date)}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const product = row.original as ProductEntity;
        const bindingFormId = product.bindingFormId;
        const slug = product.slug || product.id;
        console.log('Product slug:', slug);
        return (
          <div className="flex items-center space-x-2">
            <Link
              target="_blank"
              href={`${process.env.NEXT_PUBLIC_WWW_URL}/products/${slug}`}
              className="text-blue-500 hover:underline"
            >
              View
            </Link>
            <Separator
              orientation={'vertical'}
            />
            <Link
              target="_blank"
              href={`/forms/${bindingFormId}`}
              className="text-blue-500 hover:underline"
            >
              Write Review
            </Link>

            {/*<AlertDialog>*/}
            {/*  <AlertDialogTrigger asChild>*/}
            {/*    /!*<BiTrash className={'text-2xl text-red-400 cursor-pointer'} />*!/*/}
            {/*    <Button variant={'ghost'}>Write Review</Button>*/}
            {/*  </AlertDialogTrigger>*/}
            {/*  <AlertDialogContent>*/}
            {/*    <AlertDialogHeader>*/}
            {/*      <AlertDialogTitle>Are you sure?</AlertDialogTitle>*/}
            {/*      <AlertDialogDescription>*/}
            {/*        This action cannot be undone. This will permanently delete*/}
            {/*        the review.*/}
            {/*      </AlertDialogDescription>*/}
            {/*    </AlertDialogHeader>*/}
            {/*    <AlertDialogFooter>*/}
            {/*      <AlertDialogCancel>Cancel</AlertDialogCancel>*/}
            {/*      <AlertDialogAction onClick={() => {}}>*/}
            {/*        Continue*/}
            {/*      </AlertDialogAction>*/}
            {/*    </AlertDialogFooter>*/}
            {/*  </AlertDialogContent>*/}
            {/*</AlertDialog>*/}
          </div>
        );
      },
    },
  ];
}
