import { FormEntity } from '@repo/api/forms';
import Link from 'next/link';
import { BiEdit, BiFile, BiMailSend, BiShare, BiTrash } from 'react-icons/bi';
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
import React from 'react';
import { useFormContext } from './context/FormProvider';
import { toLocalDateString } from '@/lib/utils';

export function FormListItem(props: {
  lang: string;
  workspaceId: string;
  item: FormEntity;
}) {
  const { lang, workspaceId, item } = props;
  const { deleteForm } = useFormContext();
  if (!item) {
    return null;
  }

  return (
    <div className="flex flex-row justify-between items-center mb-4 w-full bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <Link
        href={`/${lang}/${workspaceId}/forms/${item.id}`}
        key={item.id}
        className="flex items-center cursor-pointer flex-1"
      >
        <div className="flex items-center">
          <div className="p-3 bg-gray-100 rounded-md mr-4">
            <BiFile className="text-2xl" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900">{item.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5 flex flex-row items-center gap-2 ">
              <span className="font-semibold">
                {item.reviewCount} responses
              </span>
              <span>•</span>
              <span> created on {toLocalDateString(item.createdAt)} </span>
            </p>
          </div>
        </div>
      </Link>
      {/* Action Icons */}
      <div className="flex items-center space-x-1">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
              <BiTrash className="text-2xl text-red-500 " />
            </div>
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
                  deleteForm(item.id);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
