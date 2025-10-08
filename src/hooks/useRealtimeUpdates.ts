import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';

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
                queryClient.invalidateQueries({ queryKey: [table] });
                queryClient.invalidateQueries({ queryKey: ['items'] });
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
