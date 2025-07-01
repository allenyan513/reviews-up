import { SortBy } from '@/types/sortby';

export const sortOptions = [
  {
    value: SortBy.newest,
    label: 'Dates from Newest to Oldest',
  },
  {
    value: SortBy.oldest,
    label: 'Dates from Oldest to Newest',
  },
  {
    value: SortBy.random,
    label: 'Random',
  },
  {
    value: SortBy.rating,
    label: 'Rating from Highest to Lowest',
  },
];
