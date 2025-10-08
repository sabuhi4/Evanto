import { useQuery } from '@tanstack/react-query';
import { getAllItems, getItemById } from '@/services';

const STALE_TIME_SHORT = 2 * 60 * 1000;
const STALE_TIME_LONG = 5 * 60 * 1000;
const MAX_RETRIES = 2;

export const useUnifiedItems = (filters?: Record<string, any>) => {
  const query = useQuery({
    queryKey: ['unified-items', filters || {}],
    queryFn: getAllItems,
    staleTime: STALE_TIME_SHORT,
    retry: (failureCount) => failureCount < MAX_RETRIES,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
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
