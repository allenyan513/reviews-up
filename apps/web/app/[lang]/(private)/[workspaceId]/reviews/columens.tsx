'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ReviewEntity } from '@repo/api/reviews/entities/review.entity';
import React from 'react';
import { BsEye, BsImage, BsPencil, BsTrash, BsTwitterX } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { ReviewMedia } from '@repo/api/reviews/entities/review-media.entity';

export const columns: ColumnDef<ReviewEntity>[] = [
  {
    id: 'reviewer',
    header: 'Reviewer',
    accessorFn: (row) => ({
      name: row.reviewerName,
      email: row.reviewerEmail,
      image: row.reviewerImage,
    }),
    cell: ({ row, getValue }) => {
      const { name, email, image } = getValue<{
        name: string;
        email: string | null;
        image: string | null;
      }>();
      return (
        <div className="flex items-center p-2">
          {image ? (
            <img
              className="h-8 w-8 rounded-full object-cover mr-3"
              src={image}
              alt={name || 'Reviewer Avatar'}
            />
          ) : (
            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-red-500 text-white text-sm font-bold mr-3">
              {name ? name.charAt(0).toUpperCase() : 'N/A'}
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">{email}</div>
          </div>
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
        medias: ReviewMedia[] | null;
        tweetId: string;
      }>();
      return (
        <div className="text-sm text-gray-700  max-w-md whitespace-normal flex flex-col">
          <p>{text}</p>
          <div className="flex flex-row gap-1 mt-2">
            {medias &&
              medias.length > 0 &&
              medias.map((media) => (
                <BsImage key={media.id} className="text-xl" />
              ))}
            {tweetId && (
              <BsTwitterX  className='text-xl'/>
            )}
          </div>

        </div>
      );
    },
  },
  {
    accessorKey: 'source',
    header: 'Source',
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      // 获取浏览器语言
      const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
      const formattedDate = new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
      return (
        <span>{formattedDate}</span>
      )
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-1">
          {/* View Icon */}
          <button className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100">
            <BsEye className={'text-xl'} />
          </button>
          {/* Edit Icon */}
          <button className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100">
            <BsPencil className={'text-xl'} />
          </button>
          {/* Delete Icon */}
          <button className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50">
            <BsTrash className={'text-xl'} />
          </button>
        </div>
      );
    },
  },
];
