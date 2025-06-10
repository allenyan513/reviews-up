'use client';

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  PaginationState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { DataTablePagination } from '@/app/[lang]/(private)/[workspaceId]/reviews/data-table-pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  // data: TData[];
  fetchData: (
    pageIndex: number,
    pageSize: number,
    sorting: SortingState,
    filters: ColumnFiltersState,
  ) => Promise<{
    data: TData[];
    pageCount: number;
    totalRowCount: number;
  } | null>;
  totalRowCount: number;
  onRowItemClick: (row: TData) => void;
}

const statusOptions = [
  {
    name: 'All',
    value: '',
  },
  {
    name: 'Pending',
    value: 'pending',
  },
  {
    name: 'Public',
    value: 'public',
  },
  {
    name: 'Hidden',
    value: 'hidden',
  },
];

export function DataTable<TData, TValue>({
  columns,
  // data,
  fetchData,
  totalRowCount,
  onRowItemClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [data, setData] = useState<TData[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pageCount,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  useEffect(() => {
    const fetchDataFromServer = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData(
          pagination.pageIndex,
          pagination.pageSize,
          sorting,
          columnFilters,
        );
        if(!response) {
          return;
        }
        setData(response.data);
        setPageCount(response.pageCount);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Handle error appropriately (e.g., show error message)
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromServer();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    columnFilters,
    fetchData,
  ]); // Dependencies

  return (
    <div>
      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-row items-center space-x-4">
          <div className="flex flex-wrap mb-4 md:mb-0 ">
            {statusOptions.map((filter, index) => (
              <Button
                className={cn(
                  'rounded-none w-24',
                  index === 0 ? 'rounded-l-lg' : '',
                  index === 3 ? 'rounded-r-lg' : '',
                  table.getColumn('status')?.getFilterValue() === filter.value
                    ? 'bg-gray-100'
                    : 'bg-white',
                )}
                key={filter.value}
                variant={'outline'}
                size={'lg'}
                onClick={() => {
                  table.getColumn('status')?.setFilterValue(filter.value);
                }}
              >
                {filter.name}
              </Button>
            ))}
          </div>
          {/*<Button className="rounded-lg" variant={'outline'} size={'lg'}>*/}
          {/*  Filters*/}
          {/*</Button>*/}
        </div>
        {/*<div className="relative w-full md:w-auto">*/}
        {/*  <input*/}
        {/*    type="text"*/}
        {/*    placeholder="Search"*/}
        {/*    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"*/}
        {/*  />*/}
        {/*  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">*/}
        {/*    <BsSearch className="text-gray-400" />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
      <DataTablePagination table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='cursor-pointer'
                  onClick={()=>{
                    onRowItemClick(row.original as TData);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
