import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getEvents, 
    getMeetups, 
    getUserBookings, 
    fetchUserProfile, 
    updateBookingStatus,
    getSeatAvailability,
    fetchUserStats,
    updateEvent,
    updateMeetup,
    deleteEvent,
    deleteMeetup,
    createEvent,
    createMeetup,
    createBooking
} from '@/services';

export const useEvents = () => {
    return useQuery({
        queryKey: ['events'],
        queryFn: getEvents,
        staleTime: 2 * 60 * 1000,
    });
};

export const useMeetups = () => {
    return useQuery({
        queryKey: ['meetups'],
        queryFn: getMeetups,
        staleTime: 2 * 60 * 1000,
    });
};

export const useBookings = () => {
    return useQuery({
        queryKey: ['bookings'],
        queryFn: getUserBookings,
        staleTime: 2 * 60 * 1000,
    });
};

export const useUser = (userId?: string) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => fetchUserProfile(userId),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useUpdateBooking = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => 
            updateBookingStatus(id, status as any),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

export const useSeatAvailability = (eventId: string) => {
    return useQuery({
        queryKey: ['seatAvailability', eventId],
        queryFn: () => getSeatAvailability(eventId),
        enabled: !!eventId,
        staleTime: 30 * 1000,
    });
};

export const useUserStats = (userId?: string) => {
    return useQuery({
        queryKey: ['userStats', userId],
        queryFn: () => fetchUserStats(userId),
        enabled: !!userId,
        staleTime: 2 * 60 * 1000,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => 
            fetchUserProfile(id).then(() => data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => 
            updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useUpdateMeetup = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => 
            updateMeetup(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetups'] });
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => deleteEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });
};

export const useDeleteMeetup = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => deleteMeetup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetups'] });
        },
    });
};

export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => createEvent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['items'] });
            queryClient.invalidateQueries({ queryKey: ['unified-items'] });
            queryClient.invalidateQueries({ queryKey: ['unified-items', {}] });
        },
    });
};

export const useCreateMeetup = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => createMeetup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['meetups'] });
            queryClient.invalidateQueries({ queryKey: ['items'] });
            queryClient.invalidateQueries({ queryKey: ['unified-items'] });
            queryClient.invalidateQueries({ queryKey: ['unified-items', {}] });
        },
    });
};

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => createBooking(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
};

