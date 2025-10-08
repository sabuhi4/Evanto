// features/SelectSeats.tsx
import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { MoreVert, ArrowCircleLeft } from '@mui/icons-material';
import { SeatPicker } from '@/components/forms/SeatPicker';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '@/store/dataStore';
import { useBookingStore } from '@/store/bookingStore';
import { showError } from '@/utils/notifications';
import GetTicket from '@/features/tickets/GetTicket';
import { useUserStore } from '@/store/userStore';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUnifiedItems } from '@/hooks/useUnifiedItems';
import { getSeatAvailability } from '@/services/dataService';
import { useEffect } from 'react';
import { supabase } from '@/utils/supabase';

function SelectSeats() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { bookingData: bookingFlow, addSeat, removeSeat } = useBookingStore();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const [showGetTicket, setShowGetTicket] = useState(false);

    // Use unified data fetching
    const { data: items = [] } = useUnifiedItems();

    const item = items.find(i => i.id === bookingFlow.event_id);

    // Fetch seat availability for the event
    const { data: seatAvailability, isLoading: availabilityLoading } = useQuery({
        queryKey: ['seatAvailability', bookingFlow.event_id],
        queryFn: () => getSeatAvailability(bookingFlow.event_id, item?.max_participants),
        enabled: !!bookingFlow.event_id && !!item,
    });

    // Set up real-time updates for seat availability
    useEffect(() => {
        if (!bookingFlow.event_id) return;

        const channel = supabase
            .channel('seat-availability')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookings',
                    filter: `event_id=eq.${bookingFlow.event_id}`,
                },
                () => {
                    // Invalidate and refetch seat availability when bookings change
                    queryClient.invalidateQueries({
                        queryKey: ['seatAvailability', bookingFlow.event_id],
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [bookingFlow.event_id, queryClient]);

    const handleSeatSelect = (seat: { row: number; column: number; type: string; price: number }) => {
        // Check if we're at the max participants limit
        if (seatAvailability && bookingFlow.selected_seats.length >= seatAvailability.availableSeats) {
            showError('No more seats available');
            return;
        }
        addSeat(seat);
    };

    const handleSeatDeselect = (seatId: string) => {
        removeSeat(seatId);
    };

    const handleShowGetTicket = () => {
        if (bookingFlow.selected_seats.length === 0) {
            showError('Please select at least one seat');
            return;
        }
        setShowGetTicket(true);
    };

    return (
        <>
            
            <Container className="relative min-h-screen">
                <Box className='mb-8 flex w-full items-center justify-between'>
                    <IconButton 
                        onClick={() => navigate(-1)} 
                        className={`${isDarkMode ? 'text-white border border-white/20 bg-transparent' : 'text-gray-600 border border-neutral-200 bg-gray-100'}`}
                        sx={{
                            border: isDarkMode ? '1px solid #FFFFFF33' : '1px solid #D1D5DB',
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                            }
                        }}
                    >
                        <KeyboardArrowLeft />
                    </IconButton>
                    <Typography variant='h4' className={`font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Select Seats</Typography>
                    <IconButton 
                        className={`${isDarkMode ? 'text-white border border-white/20 bg-transparent' : 'text-gray-600 border border-neutral-200 bg-gray-100'}`}
                        sx={{
                            border: isDarkMode ? '1px solid #FFFFFF33' : '1px solid #D1D5DB',
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                            }
                        }}
                    >
                        <MoreVert />
                    </IconButton>
                </Box>

            {availabilityLoading ? (
                <Box className="flex justify-center py-8">
                    <Typography className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading seat availability...</Typography>
                </Box>
            ) : seatAvailability?.isFullyBooked ? (
                <Box className="flex flex-col items-center py-8">
                    <Typography variant="h6" color="error" className="mb-2">
                        Event Fully Booked
                    </Typography>
                    <Typography variant="body2" className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        All seats for this event have been booked.
                    </Typography>
                </Box>
            ) : (
                <SeatPicker
                    onSeatSelect={handleSeatSelect}
                    onSeatDeselect={handleSeatDeselect}
                    selectedSeats={bookingFlow.selected_seats}
                    bookedSeats={seatAvailability?.bookedSeats || []}
                    maxParticipants={item?.max_participants}
                    item={item}
                />
            )}

            <Button
                variant='contained'
                onClick={handleShowGetTicket}
                disabled={bookingFlow.selected_seats.length === 0}
                size='large'
                className='w-full h-12 mt-4'
                sx={{
                    backgroundColor: '#5D9BFC',
                    '&:hover': {
                        backgroundColor: '#4A8BFC',
                    },
                    '&:disabled': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.26)',
                    }
                }}
            >
                Get Ticket
            </Button>

            <GetTicket open={showGetTicket} onClose={() => setShowGetTicket(false)} item={item} />
            </Container>
        </>
    );
}

export default SelectSeats;

