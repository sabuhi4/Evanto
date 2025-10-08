import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    fetchPaymentCards,
    createPaymentCard,
    updatePaymentCard,
    deletePaymentCard,
    setDefaultPaymentCard,
} from '@/services';

export const usePaymentCards = () => {
    return useQuery({
        queryKey: ['payment-cards'],
        queryFn: fetchPaymentCards,
    });
};

export const useCreatePaymentCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPaymentCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-cards'] });
        },
    });
};

export const useUpdatePaymentCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updatePaymentCard>[1] }) =>
            updatePaymentCard(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-cards'] });
        },
    });
};

export const useDeletePaymentCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePaymentCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-cards'] });
        },
    });
};

export const useSetDefaultPaymentCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: setDefaultPaymentCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment-cards'] });
        },
    });
};
