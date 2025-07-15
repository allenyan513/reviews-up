'use client';

import { ColumnDef, useReactTable } from '@tanstack/react-table';
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { api } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { BiShow, BiTrash } from 'react-icons/bi';
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
import { cn, toLocalDateString } from '@/lib/utils';
import Link from 'next/link';

export function columns(setData: any): ColumnDef<any>[] {
  const deleteOne = async (id: string) => {
    try {
      await api.campaign.deleteOne(id);
      setData((prevData: any[]) =>
        prevData.filter((review) => review.id !== id),
      );
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  return [
    {
      accessorKey: 'name',
      header: 'Name',
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
        return <span>{toLocalDateString(date)}</span>;
      },
    },
    {
      id: 'from',
      header: 'From',
      accessorFn: (row) => ({
        fromName: row.fromName,
        fromEmail: row.fromEmail,
      }),
      cell: ({ row, getValue }) => {
        const { fromName, fromEmail } = getValue<{
          fromName: string;
          fromEmail: string | null;
        }>();
        return (
          <div className="flex flex-col gap-1">
            <span>{fromName}</span>
            <span className="text-sm text-gray-500">{fromEmail}</span>
          </div>
        );
      },
    },
    // {
    //   accessorKey:'fromName',
    //   header: 'From Name',
    // },
    {
      accessorKey: 'toEmails',
      header: 'To',
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
    },
    {
      accessorKey: 'isTest',
      header: 'Test',
      cell: ({ row }) => {
        const isTest = row.getValue('isTest') as boolean;
        return <span>{isTest ? 'Yes' : 'No'}</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row, table }) => {
        const status = row.getValue('status') as string;
        return (
          <Button
            variant={'outline'}
            className={cn(
              `text-sm font-medium rounded-full`,
              status === 'sent'
                ? 'bg-green-100 text-green-800'
                : status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : status === 'sending'
                    ? 'bg-blue-100 text-blue-800'
                    : status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : '',
            )}
          >
            {/*{status === 'draft' && <BiInfoCircle className=""/>}*/}
            {/*{status === 'sending' && <BiShow className=""/>}*/}
            {/*{status === 'sent' && <BiHide className=""/>}*/}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorFn: (row) => ({
        id: row.id,
        productId: row.productId,
      }),
      cell: ({ row, getValue }) => {
        const { id, productId } = getValue<{
          id: string;
          productId: string;
        }>();
        return (
          <div className="flex items-center space-x-2">
            <Link href={`/${productId}/campaigns/${id}`}>
              <BiShow className={'text-2xl cursor-pointer'} />
            </Link>
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
                      deleteOne(id);
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
