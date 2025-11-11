import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    fetchPaymentCards,
    createPaymentCard,
    updatePaymentCard,
    deletePaymentCard,
    setDefaultPaymentCard,
} from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export const usePaymentCards = () => {
    return useQuery({
        queryKey: queryKeys.paymentCards(),
        queryFn: fetchPaymentCards,
    });
};

export const useCreatePaymentCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPaymentCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.paymentCards() });
        },
    });
};

export const useUpdatePaymentCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updatePaymentCard>[1] }) =>
            updatePaymentCard(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.paymentCards() });
        },
    });
};

export const useDeletePaymentCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePaymentCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.paymentCards() });
        },
    });
};

export const useSetDefaultPaymentCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: setDefaultPaymentCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.paymentCards() });
        },
    });
};
