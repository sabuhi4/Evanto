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
    createBooking,
    updateUser
} from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export const useEvents = () => {
    return useQuery({
        queryKey: queryKeys.events(),
        queryFn: getEvents,
        staleTime: 2 * 60 * 1000,
    });
};

export const useMeetups = () => {
    return useQuery({
        queryKey: queryKeys.meetups(),
        queryFn: getMeetups,
        staleTime: 2 * 60 * 1000,
    });
};

export const useBookings = () => {
    return useQuery({
        queryKey: queryKeys.bookings(),
        queryFn: getUserBookings,
        staleTime: 2 * 60 * 1000,
    });
};

export const useUser = (userId?: string) => {
    return useQuery({
        queryKey: queryKeys.user(userId || ''),
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
            queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
        },
    });
};

export const useSeatAvailability = (eventId: string) => {
    return useQuery({
        queryKey: queryKeys.seatAvailability(eventId),
        queryFn: () => getSeatAvailability(eventId),
        enabled: !!eventId,
        staleTime: 30 * 1000,
    });
};

export const useUserStats = (userId?: string) => {
    return useQuery({
        queryKey: queryKeys.userStats(userId || ''),
        queryFn: () => fetchUserStats(userId),
        enabled: !!userId,
        staleTime: 2 * 60 * 1000,
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            updateUser(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.user(variables.id) });
        },
    });
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.events() });
            queryClient.invalidateQueries({ queryKey: queryKeys.unifiedItems() });
        },
    });
};

export const useUpdateMeetup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            updateMeetup(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.meetups() });
            queryClient.invalidateQueries({ queryKey: queryKeys.unifiedItems() });
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.events() });
            queryClient.invalidateQueries({ queryKey: queryKeys.unifiedItems() });
        },
    });
};

export const useDeleteMeetup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteMeetup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.meetups() });
            queryClient.invalidateQueries({ queryKey: queryKeys.unifiedItems() });
        },
    });
};

export const useCreateEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => createEvent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.events() });
            queryClient.invalidateQueries({ queryKey: queryKeys.unifiedItems() });
        },
    });
};

export const useCreateMeetup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => createMeetup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.meetups() });
            queryClient.invalidateQueries({ queryKey: queryKeys.unifiedItems() });
        },
    });
};

export const useCreateBooking = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => createBooking(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.bookings() });
        },
    });
};

