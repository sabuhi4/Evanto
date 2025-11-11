import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { queryKeys } from '@/lib/queryKeys';

const createRealtimeChannel = (table: string, queryClient: any) => {
    return supabase
        .channel(`${table}-changes`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table,
            },
            () => {
                if (table === 'events') {
                    queryClient.invalidateQueries({ queryKey: queryKeys.events() });
                } else if (table === 'meetups') {
                    queryClient.invalidateQueries({ queryKey: queryKeys.meetups() });
                } else if (table === 'bookings') {
                    queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
                }
                queryClient.invalidateQueries({ queryKey: queryKeys.unifiedItems() });
            }
        )
        .subscribe();
};

export const useRealtimeUpdates = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const channels = [
            createRealtimeChannel('events', queryClient),
            createRealtimeChannel('meetups', queryClient),
            createRealtimeChannel('bookings', queryClient),
        ];

        return () => {
            channels.forEach(channel => supabase.removeChannel(channel));
        };
    }, [queryClient]);
};
