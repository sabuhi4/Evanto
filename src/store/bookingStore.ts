import { create } from 'zustand';
import type { BookingFormData } from '@/utils/schemas';

type SeatInfo = {
    seat: string;
    type: string;
    row: number;
    column: number;
    price: number;
};

interface BookingData extends BookingFormData {
    event_name?: string;
    event_location?: string;
    event_date?: Date;
    event_time?: string;
    selected_seats: SeatInfo[];
    promo_code?: string;
    payment_method?: string;
    booking_id?: string;
}

interface BookingStore {
    bookingData: BookingData;
    setBookingData: (data: Partial<BookingData>) => void;
    addSeat: (seat: Omit<SeatInfo, 'seat'>) => void;
    removeSeat: (seatId: string) => void;
    clearBookingData: () => void;
    getTotalPrice: () => number;
}

const initialBookingData: BookingData = {
    first_name: '',
    last_name: '',
    gender: 'male',
    birth_date: new Date(),
    email: '',
    phone: '',
    country: '',
    accept_terms: false,
    selected_seats: [],
};

export const useBookingStore = create<BookingStore>((set, get) => ({
    bookingData: initialBookingData,

    setBookingData: data =>
        set(state => ({
            bookingData: { ...state.bookingData, ...data },
        })),

    addSeat: (seat: Omit<SeatInfo, 'seat'>) =>
        set(state => {
            const adjustedPrice = seat.type.toLowerCase() === 'vip' ? seat.price * 1.2 : seat.price;
            const seatWithId: SeatInfo = {
                seat: `${String.fromCharCode(65 + seat.row)}${seat.column + 1}`,
                type: seat.type,
                row: seat.row,
                column: seat.column,
                price: adjustedPrice,
            };
            
            return {
                bookingData: { 
                    ...state.bookingData, 
                    selected_seats: [...state.bookingData.selected_seats, seatWithId]
                },
            };
        }),

    removeSeat: (seatId: string) =>
        set(state => {
            const [row, column] = seatId.split('-').map(Number);
            const updatedSeats = state.bookingData.selected_seats.filter(
                s => !(s.row === row && s.column === column)
            );
            
            return {
                bookingData: { ...state.bookingData, selected_seats: updatedSeats },
            };
        }),

    clearBookingData: () => set({ bookingData: initialBookingData }),

    getTotalPrice: () => get().bookingData.selected_seats.reduce((sum, seat) => sum + seat.price, 0),
}));

