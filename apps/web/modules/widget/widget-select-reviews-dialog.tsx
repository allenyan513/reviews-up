import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@reviewsup/ui/dialog';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { columns } from '@/modules/review/review-list-page-columns';
import React from 'react';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { api } from '@/lib/api-client';
import { useUserContext } from '@/context/UserProvider';
import { selectionColumns } from '@/modules/review/review-list-page-columns-select';

export function WidgetSelectReviewsDialog(props: {
  defaultSelectedRowIds: string[];
  onSelectionChange: (ids: string[]) => void;
}) {
  const { defaultSelectedRowIds , onSelectionChange} = props;
  const { defaultProduct } = useUserContext();
  const [ids, setIds] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);

  const fetchReviews = async (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState,
    filters: ColumnFiltersState,
  ) => {
    if (!defaultProduct) {
      throw new Error('Product ID is required to fetch reviews');
    }
    const res = await api.review.getReviews({
      page: pageIndex + 1,
      pageSize: pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    return {
      data: res.items,
      pageCount: res.meta.pageCount,
      totalRowCount: res.meta.total,
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="">
          Select
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full md:max-w-6xl overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Manage Reviews</DialogTitle>
          <DialogDescription>
            Add or remove review IDs to customize the widget content.
          </DialogDescription>
        </DialogHeader>
        <DataTable
          fetchData={fetchReviews}
          columns={selectionColumns}
          config={{}}
          defaultSelectedRowIds={props.defaultSelectedRowIds}
          onSelectionChange={(ids: string[]) => {
            setIds(ids);
          }}
        />
        <DialogFooter>
          <Button
            type="button"
            variant="default"
            onClick={() => {
              setOpen(false);
              props.onSelectionChange(ids);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
