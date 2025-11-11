const EMPTY_OPTIONS = {};

export const queryKeys = {
    events: () => ['events'] as const,
    meetups: () => ['meetups'] as const,
    bookings: () => ['bookings'] as const,
    userBookings: () => ['userBookings'] as const,

    user: (userId: string) => ['user', userId] as const,
    userStats: (userId: string) => ['userStats', userId] as const,

    favorites: (userId: string | undefined) => ['favorites', userId] as const,

    seatAvailability: (eventId: string) => ['seatAvailability', eventId] as const,
    meetupAvailability: (meetupId: string) => ['meetupAvailability', meetupId] as const,

    unifiedItems: (options?: Record<string, any>) => ['unified-items', options ?? EMPTY_OPTIONS] as const,
    unifiedItem: (id: string, type: string) => ['unified-item', id, type] as const,

    paymentCards: () => ['payment-cards'] as const,

    items: () => ['items'] as const,
};
