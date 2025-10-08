import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { updateEvent, updateMeetup } from '@/services/dataService';
import { showSuccess, showError } from '@/utils/notifications';
import type { UnifiedItem } from '@/utils/schemas';

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

            await queryClient.invalidateQueries({ queryKey: ['events'] });
            await queryClient.invalidateQueries({ queryKey: ['meetups'] });
            await queryClient.invalidateQueries({ queryKey: ['unifiedItems'] });
            
        } catch (error) {
            console.error('Error cancelling event:', error);
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
