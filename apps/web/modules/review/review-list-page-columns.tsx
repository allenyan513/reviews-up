'use client';

import { ColumnDef, useReactTable } from '@tanstack/react-table';
import { ReviewEntity, ReviewMediaEntity } from '@reviewsup/api/reviews';
import React from 'react';
import { BsCameraVideo, BsFilter, BsImage, BsSortDown } from 'react-icons/bs';
import { BiSort, BiFilterAlt, BiSortAlt2 } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@reviewsup/embed-react';
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

export function columns(setData: any): ColumnDef<any>[] {
  const deleteReview = async (reviewId: string) => {
    try {
      await api.review.deleteReview(reviewId);
      setData((prevData: any[]) =>
        prevData.filter((review) => review.id !== reviewId),
      );
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };
  const updateReviewStatus = async (
    reviewId: string,
    currentStatus: ReviewStatus,
  ) => {
    try {
      let newStatus: ReviewStatus;
      if (currentStatus === 'pending') {
        newStatus = 'public';
      } else if (currentStatus === 'public') {
        newStatus = 'hidden';
      } else if (currentStatus === 'hidden') {
        newStatus = 'public';
      } else {
        throw new Error('Invalid review status');
      }
      await api.review.updateReview(reviewId, { status: newStatus });
      setData((prevData: ReviewEntity[]) =>
        prevData.map((review) =>
          review.id === reviewId ? { ...review, status: newStatus } : review,
        ),
      );
      toast.success(`Review status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update review status');
    }
  };

  return [
    {
      id: 'reviewer',
      header: 'Reviewer',
      enableResizing: true,
      size: 100,
      accessorFn: (row) => ({
        reviewerName: row.reviewerName,
        reviewerEmail: row.reviewerEmail,
        reviewerImage: row.reviewerImage,
        reviewerTitle: row.reviewerTitle,
        rating: row.rating,
      }),
      cell: ({ row, getValue }) => {
        const {
          reviewerName,
          reviewerEmail,
          reviewerTitle,
          reviewerImage,
          rating,
        } = getValue<{
          reviewerName: string;
          reviewerEmail: string | null;
          reviewerTitle: string | null;
          reviewerImage: string | null;
          rating: number | null;
        }>();
        return (
          <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-row items-center gap-2">
              <Avatar className="size-10 shadow-md border">
                <AvatarImage
                  src={reviewerImage || ''}
                  alt={reviewerName || 'Reviewer'}
                />
                <AvatarFallback className="AvatarFallback" delayMs={600}>
                  {reviewerName.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {reviewerName}
                </div>
                <div className="text-sm text-gray-500">{reviewerTitle}</div>
                <div className="text-sm text-gray-500">{reviewerEmail}</div>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'rating',
      header: ({ column }) => {
        return (
          <div className="flex flex-row items-center gap-2">
            <p>Rating</p>
            <BiSortAlt2
              className="cursor-pointer text-lg"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <BiFilterAlt className="cursor-pointer text-lg" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.setFilterValue(1)}>
                  1/5
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue(2)}>
                  2/5
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue(3)}>
                  3/5
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue(4)}>
                  4/5
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.setFilterValue(5)}>
                  5/5
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      cell: ({ row }) => {
        const rating = row.getValue('rating') as number | null;
        return (
          <div className="flex items-center">
            <StarRating size={'sm'} value={rating || 5} className="ml-1" />
          </div>
        );
      },
    },
    {
      id: 'message',
      header: 'Message',
      accessorFn: (row) => ({
        text: row.text,
        medias: row.medias,
        tweetId: row.tweetId,
      }),
      cell: ({ row, getValue }) => {
        const { text, medias, tweetId } = getValue<{
          text: string;
          medias: ReviewMediaEntity[] | null;
          tweetId: string;
        }>();
        const review = row.original as ReviewEntity;
        return (
          <ReviewLookupDialog review={review}>
            <div className="text-sm text-gray-700  max-w-md whitespace-break-spaces flex flex-col cursor-pointer">
              <p className="whitepace-break-spaces line-clamp-3">{text}</p>
              <div className="flex flex-row gap-1 mt-2">
                {medias &&
                  medias.length > 0 &&
                  medias.map((media) => {
                    if (media.type === 'video') {
                      return (
                        <BsCameraVideo key={media.id} className="text-xl" />
                      );
                    } else if (media.type === 'image') {
                      return <BsImage key={media.id} className="text-xl" />;
                    } else {
                      return null;
                    }
                  })}
              </div>
            </div>
          </ReviewLookupDialog>
        );
      },
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => {
        const source = row.getValue('source') as string;
        return <ReviewItemSource2 source={source} />;
      },
    },
    {
      accessorKey: 'status',
      header: function StatusHeader({ column }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-semibold">
                Status ⏷
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => column.setFilterValue(undefined)}
              >
                <BiListCheck />
                All
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => column.setFilterValue('pending')}
              >
                <BiInfoCircle />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue('public')}>
                <BiShow />
                Public
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.setFilterValue('hidden')}>
                <BiHide />
                Hidden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      cell: ({ row, table }) => {
        const reviewId = row.original.id;
        const status = row.getValue('status') as string;
        return (
          <Button
            onClick={() => {
              updateReviewStatus(reviewId, status as ReviewStatus);
            }}
            variant={'outline'}
            className={cn(
              `text-sm font-medium rounded-full`,
              status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : status === 'public'
                  ? 'bg-green-100 text-green-800'
                  : status === 'hidden'
                    ? 'bg-gray-100 text-gray-800'
                    : '',
            )}
          >
            {status === 'pending' && <BiInfoCircle className="" />}
            {status === 'public' && <BiShow className="" />}
            {status === 'hidden' && <BiHide className="" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
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
        const review = row.original;
        return (
          <div className="flex items-center space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <BiTrash className={'text-2xl text-red-400 cursor-pointer'} />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the review.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteReview(review.id);
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
}
