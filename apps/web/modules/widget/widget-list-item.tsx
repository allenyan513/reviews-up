import {
  WidgetConfig,
  WidgetEntity,
} from '@reviewsup/api/widgets';
import { useWidgetContext } from '@/modules/widget/context/widget-context';
import Link from 'next/link';
import { BiFile, BiTrash } from 'react-icons/bi';
import { toLocalDateString } from '@/lib/utils';
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

export function WidgetListItem(props: {
  item: WidgetEntity;
  lang: string;
  productId: string;
}) {
  const { deleteWidget } = useWidgetContext();
  const { item, lang, productId } = props;

  const config = item.config as WidgetConfig;

  return (
    <div
      className="flex flex-row justify-between items-center mb-4 w-full bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200"
      key={item.id}
    >
      <Link
        key={item.id}
        href={`/${lang}/${productId}/widgets/${item.id}`}
        className="flex items-center flex-1"
      >
        <div className="flex items-center">
          <div className="p-3 bg-gray-100 rounded-md mr-4">
            <BiFile className="text-2xl" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 w-full">
              {item.name}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              <span className="font-semibold">
                {config.type?.toUpperCase()} Layout
              </span>{' '}
              created on {toLocalDateString(item.createdAt|| new Date())}
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
                  deleteWidget(item.id || '');
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
