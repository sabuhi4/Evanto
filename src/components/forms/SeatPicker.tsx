import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { UnifiedItem } from '@/utils/schemas';
import { useUserStore } from '@/store/userStore';

interface SeatPickerProps {
    onSeatSelect: (seat: { row: number; column: number; type: string; price: number }) => void;
    onSeatDeselect: (seatId: string) => void;
    selectedSeats: { row: number; column: number; type: string; price: number }[];
    bookedSeats: string[];
    maxParticipants?: number | null;
    item?: UnifiedItem;
}

export const SeatPicker: React.FC<SeatPickerProps> = ({ onSeatSelect, onSeatDeselect, selectedSeats, bookedSeats, maxParticipants, item }) => {
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const getSeatPrice = (row: number) => {
        // For events, use the event's ticket_price
        if (item && item.type === 'event') {
            // Check if ticket_price exists and is a valid number
            if (typeof item.ticket_price === 'number' && item.ticket_price > 0) {
                return item.ticket_price;
            }
        }
        
        // For meetups, price is 0
        if (item?.type === 'meetup') {
            return 0;
        }

        // Fallback prices (should not be used for events with ticket_price)
        return row === 0 ? 19.99 : row < 3 ? 12.99 : 10.99;
    };

    const getSeatId = (row: number, column: number) => {
        return `${String.fromCharCode(65 + row)}${column + 1}`;
    };

    const isSeatBooked = (row: number, column: number) => {
        const seatId = getSeatId(row, column);
        return bookedSeats.includes(seatId);
    };

    const isSeatSelected = (row: number, column: number) => {
        return selectedSeats.some(s => s.row === row && s.column === column);
    };

    const isSeatAvailable = (row: number, column: number) => {
        return !isSeatBooked(row, column) && !isSeatSelected(row, column);
    };

    const toggleSeat = (row: number, column: number) => {
        // Don't allow selection of booked seats
        if (isSeatBooked(row, column)) {
            return;
        }

        const seatId = `${row}-${column}`;
        const isSelected = isSeatSelected(row, column);

        if (isSelected) {
            onSeatDeselect(seatId);
        } else {
            const seatType = row === 0 ? 'VIP' : 'Standard';
            const price = getSeatPrice(row);
            onSeatSelect({ row, column, type: seatType, price });
        }
    };

    const seatTypes = {
        normal: {
            component: (selected: boolean, booked: boolean, available: boolean) => (
                <svg
                    width='25'
                    height='40'
                    viewBox='0 0 25 40'
                    fill='none'
                    className={`transition-colors ${
                        booked 
                            ? 'cursor-not-allowed opacity-50' 
                            : available 
                                ? 'cursor-pointer hover:opacity-80' 
                                : 'cursor-not-allowed opacity-50'
                    }`}
                >
                    <rect
                        width='25'
                        height='40'
                        rx='10'
                        fill={
                            booked 
                                ? (isDarkMode ? 'rgb(248 248 248)' : 'rgb(229 231 235)')
                                : selected 
                                    ? 'rgb(93 155 252)'
                                    : (isDarkMode ? 'transparent' : 'rgb(249 250 251)')
                        }
                        stroke={
                            booked 
                                ? (isDarkMode ? 'rgb(248 248 248)' : 'rgb(229 231 235)')
                                : selected 
                                    ? 'rgb(93 155 252)'
                                    : (isDarkMode ? 'rgb(255 255 255 / 0.15)' : 'rgb(209 213 219)')
                        }
                        strokeWidth='1'
                    />
                </svg>
            ),
        },
    };

    const renderRow = (row: number) => {
        return (
            <Box key={`row-${row}`} className='flex justify-center gap-2'>
                {Array(9)
                    .fill(0)
                    .map((_, column) => {
                        const isSelected = isSeatSelected(row, column);
                        const isBooked = isSeatBooked(row, column);
                        const isAvailable = isSeatAvailable(row, column);
                        
                        return (
                            <Box 
                                key={`${row}-${column}`} 
                                onClick={() => toggleSeat(row, column)}
                                title={`Seat ${getSeatId(row, column)} - ${
                                    isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'
                                }`}
                            >
                                {seatTypes.normal.component(isSelected, isBooked, isAvailable)}
                            </Box>
                        );
                    })}
            </Box>
        );
    };

    return (
        <Box>
            <Box className='relative mb-8 flex justify-center'>
                <svg width='335' height='168' viewBox='0 0 335 168' fill='none'>
                    <path
                        d='M1.58743e-05 0.500014C1.97579e-05 44.9238 17.6473 87.5281 49.0596 118.94C80.472 150.353 123.076 168 167.5 168C211.924 168 254.528 150.353 285.94 118.94C317.353 87.5281 335 44.9238 335 0.500015L167.5 0.499999L1.58743e-05 0.500014Z'
                        fill={isDarkMode ? 'rgb(255 255 255 / 0.15)' : 'rgb(229 231 235)'}
                        stroke={isDarkMode ? 'rgb(255 255 255 / 0.15)' : 'rgb(209 213 219)'}
                        strokeWidth='1'
                    />
                </svg>
            </Box>

            <Box className='flex flex-col items-center gap-2'>
                {Array(Math.min(7, Math.ceil((maxParticipants || 63) / 9)))
                    .fill(0)
                    .map((_, row) => renderRow(row))}
            </Box>

            <Divider 
                className='my-3'
                sx={{
                    borderColor: isDarkMode ? 'rgb(255 255 255 / 0.15)' : 'rgb(229 231 235)',
                    '&::before, &::after': {
                        borderColor: isDarkMode ? 'rgb(255 255 255 / 0.15)' : 'rgb(229 231 235)',
                    }
                }}
            >
                <Typography 
                    variant='body2' 
                    className={`px-4 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}
                >
                    Basic
                </Typography>
            </Divider>

            <Box className='flex justify-between'>
                {[
                    { 
                        color: isDarkMode ? 'transparent' : 'rgb(249 250 251)', 
                        borderColor: isDarkMode ? 'rgb(255 255 255 / 0.15)' : 'rgb(209 213 219)',
                        label: 'Available' 
                    },
                    { 
                        color: isDarkMode ? 'rgb(248 248 248)' : 'rgb(229 231 235)', 
                        borderColor: isDarkMode ? 'rgb(248 248 248)' : 'rgb(229 231 235)',
                        label: 'Booked' 
                    },
                    { 
                        color: 'rgb(93 155 252)', 
                        borderColor: 'rgb(93 155 252)',
                        label: 'Selected' 
                    },
                ].map(item => (
                    <Box key={item.label} className='flex items-center gap-2'>
                        <Box 
                            className={`h-4 w-4 rounded-full border`}
                            style={{
                                backgroundColor: item.color,
                                borderColor: item.borderColor,
                                borderWidth: '1px'
                            }}
                        />
                        <Typography 
                            variant='body2'
                            className={isDarkMode ? 'text-neutral-400' : 'text-neutral-700'}
                        >
                            {item.label}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

