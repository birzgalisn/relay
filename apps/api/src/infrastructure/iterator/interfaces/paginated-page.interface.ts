export type PaginatedPage<T> = {
  nodes: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
};
