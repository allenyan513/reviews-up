export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginateResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export type PaginateRequest = {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};
