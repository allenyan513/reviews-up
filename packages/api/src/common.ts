export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
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

export enum SortBy {
  newest = 'newest',
  oldest = 'oldest',
  random = 'random',
  rating = 'rating',
}

export type RRResponse<T> = {
  code: number;
  message: string;
  data: T;
};
