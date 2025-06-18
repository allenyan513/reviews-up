'use client';

import {ColumnDef, useReactTable} from '@tanstack/react-table';
import {ReviewEntity} from '@repo/api/reviews/entities/review.entity';
import React from 'react';
import {
  BsCameraVideo,
  BsEye,
  BsImage,
  BsTrash,
} from 'react-icons/bs';
import {Button} from '@/components/ui/button';
import {ArrowUpDown} from 'lucide-react';
import {ReviewMedia} from '@repo/api/reviews/entities/review-media.entity';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import StarRating from '@/modules/review/review-import-manual-dialog/star-rating';
import {ReviewItemSource} from '@/modules/showcase/review-item-source';
import {api} from '@/lib/api-client';
import {$Enums} from '@repo/database/generated/client';
import ReviewStatus = $Enums.ReviewStatus;
import toast from 'react-hot-toast';
import {BiHide, BiInfoCircle, BiShow, BiTrash} from 'react-icons/bi';
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
} from "@/components/ui/alert-dialog"
import {toLocalDateString} from "@/lib/utils";


export function getColumns(setData: any): ColumnDef<any>[] {
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
  }
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
      await api.review.updateReview(reviewId, {status: newStatus});
      setData((prevData: ReviewEntity[]) =>
        prevData.map((review) =>
          review.id === reviewId ? {...review, status: newStatus} : review,
        ),
      );
      toast.success(`Review status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update review status');
    }
  };

  return (
    [
      {
        id: 'reviewer',
        header: 'Reviewer',
        accessorFn: (row) => ({
          name: row.reviewerName,
          email: row.reviewerEmail,
          image: row.reviewerImage,
          rating: row.rating,
        }),
        cell: ({row, getValue}) => {
          const {name, email, image, rating} = getValue<{
            name: string;
            email: string | null;
            image: string | null;
            rating: number | null;
          }>();
          return (
            <div className="flex flex-col gap-2 p-2">
              <div className="flex flex-row items-center gap-2">
                <Avatar className="size-10 shadow-md border">
                  <AvatarImage src={image || ''} alt={name || 'Reviewer'}/>
                  <AvatarFallback className="AvatarFallback" delayMs={600}>
                    {name.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-gray-900">{name}</div>
                  <div className="text-sm text-gray-500">{email}</div>
                </div>
              </div>
              <StarRating
                className="ml-1"
                value={rating || 5}
                onChange={() => {
                }}
              />
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
        cell: ({row, getValue}) => {
          const {text, medias, tweetId} = getValue<{
            text: string;
            medias: ReviewMedia[] | null;
            tweetId: string;
          }>();
          return (
            <div className="text-sm text-gray-700  max-w-md whitespace-normal flex flex-col">
              <p>{text}</p>
              <div className="flex flex-row gap-1 mt-2">
                {medias &&
                  medias.length > 0 &&
                  medias.map((media) => {
                    if (media.type === 'video') {
                      return <BsCameraVideo key={media.id} className="text-xl"/>;
                    } else if (media.type === 'image') {
                      return <BsImage key={media.id} className="text-xl"/>;
                    } else {
                      return null;
                    }
                  })}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'source',
        header: 'Source',
        cell: ({row}) => {
          const source = row.getValue('source') as string;
          return <ReviewItemSource source={source}/>;
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({row, table}) => {
          const reviewId = row.original.id;
          const status = row.getValue('status') as string;
          const handleStatusChange = async () => {
            //todo
          };
          return (
            <Button
              onClick={() => {
                updateReviewStatus(reviewId, status as ReviewStatus)
              }}
              variant={'outline'}
              className={`text-sm font-medium rounded-full`}
            >
              {status === 'pending' && <BiInfoCircle className=""/>}
              {status === 'public' && <BiShow className=""/>}
              {status === 'hidden' && <BiHide className=""/>}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({column}) => {
          return (
            <Button
              variant={'ghost'}
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4"/>
            </Button>
          );
        },
        cell: ({row}) => {
          const date = new Date(row.getValue('createdAt'));
          return <span>{toLocalDateString(date)}</span>;
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({row}) => {
          const review = row.original;
          return (
            <div className="flex items-center space-x-2">
              <ReviewLookupDialog review={review}>
                <BiShow className={'text-2xl cursor-pointer'}/>
              </ReviewLookupDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <BiTrash className={'text-2xl text-red-400 cursor-pointer'}/>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      review.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteReview(review.id)
                      }}
                    >Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        },
      },
    ]
  )
}
