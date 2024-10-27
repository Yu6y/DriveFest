export const SORT_BY = {
  ASC: 'ASC',
  DESC: 'DESC',
  NONE: 'NONE',
} as const;

export type SortBy = keyof typeof SORT_BY;
