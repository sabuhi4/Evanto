import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { updateEvent, updateMeetup } from '@/services/dataService';
import { showSuccess, showError } from '@/utils/notifications';
import type { UnifiedItem } from '@/utils/schemas';
import { queryKeys } from '@/lib/queryKeys';

export const useCancelEvent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const cancelEvent = async (item: UnifiedItem) => {
        if (!item.id) {
            showError('Event ID not found');
            return;
        }

        setIsLoading(true);
        try {
            if (item.type === 'event') {
                await updateEvent(item.id, { status: 'cancelled' });
                showSuccess('Event cancelled successfully');
            } else if (item.type === 'meetup') {
                await updateMeetup(item.id, { status: 'cancelled' });
                showSuccess('Meetup cancelled successfully');
            }

            if (item.type === 'event') {
                await queryClient.invalidateQueries({ queryKey: queryKeys.events() });
            } else {
                await queryClient.invalidateQueries({ queryKey: queryKeys.meetups() });
            }
            await queryClient.invalidateQueries({ queryKey: queryKeys.unifiedItems() });
            
        } catch (error) {
            showError('Failed to cancel event. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        cancelEvent,
        isLoading,
    };
};
