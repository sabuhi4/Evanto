import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getAllItems, getItemById } from '@/services';

const STALE_TIME_SHORT = 2 * 60 * 1000;
const STALE_TIME_LONG = 5 * 60 * 1000;
const MAX_RETRIES = 2;
const PAGE_SIZE = 20;

export const useUnifiedItems = (options?: {
  pageSize?: number;
  sortBy?: 'start_date' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}) => {
  const query = useInfiniteQuery({
    queryKey: ['unified-items', options || {}],
    queryFn: ({ pageParam = 0 }) =>
      getAllItems({
        page: pageParam,
        pageSize: options?.pageSize || PAGE_SIZE,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < (options?.pageSize || PAGE_SIZE)) {
        return undefined;
      }
      return allPages.length;
    },
    staleTime: STALE_TIME_SHORT,
    retry: (failureCount) => failureCount < MAX_RETRIES,
  });

  const allData = query.data?.pages.flat() || [];

  return {
    data: allData,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};

export const useUnifiedItem = (id: string, type: 'event' | 'meetup') => {
  const query = useQuery({
    queryKey: ['unified-item', id, type],
    queryFn: () => getItemById(id, type),
    enabled: !!id && !!type,
    staleTime: STALE_TIME_LONG,
    retry: (failureCount) => failureCount < MAX_RETRIES,
  });

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
