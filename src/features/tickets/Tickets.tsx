import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ButtonGroup, IconButton, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Container } from '@mui/material';
import { useUserStore } from '@/store/userStore';

import { BottomAppBar } from "../../components/navigation/BottomAppBar";
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { PageHeader } from '@/components/layout/PageHeader';
import { showSuccess, showError } from '@/utils/notifications';
import { useNavigate } from 'react-router-dom';
import { type Booking } from "@/utils/schemas";
import { useUnifiedItems } from '@/hooks/useUnifiedItems';
import { useUpdateBooking, useBookings } from "@/hooks/useData";
import { formatSmartDate } from "@/utils/format";
import { usePagination } from "@/hooks/usePagination";
import TicketCard from "../../components/cards/TicketCard";


function Tickets() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [ticketToCancel, setTicketToCancel] = useState<string | null>(null);
    const { getVisibleItems, loadMore, hasMore, getRemainingCount, reset } = usePagination();
    const queryClient = useQueryClient();
    const updateBookingStatusMutation = useUpdateBooking();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const { user: authUser } = useUserStore();

    // Use unified data fetching
    const { data: items = [] } = useUnifiedItems();
    const { data: bookings = [], isLoading: bookingsLoading } = useBookings();

    // Simple data merging with unified items
    const matchedItems = useMemo(() => {
        if (!bookings.length) return [];

        return bookings.map(booking => {
            const item = items.find(i => i.id === booking.event_id);
            
            if (!item) return null;

            return {
                ...item,
                booking: booking
            };
        }).filter(Boolean);
    }, [bookings, items]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        reset(); // Reset pagination when switching tabs
    };

    const handleEventClick = (item: any) => {
        const ticketId = item.booking.booking_id || item.booking.id;
        navigate(`/tickets/${ticketId}`, { 
            state: { 
                ticket: {
                    id: ticketId,
                    imageUrl: item.event_image || item.image_url || '/illustrations/eventcard.png',
                    eventName: item.title || 'Event Name',
                    eventLocation: item.location || 'Location TBD',
                    seatNumber: item.booking?.selected_seats?.length > 0 ? 
                        item.booking.selected_seats.map((seat: any) => seat.seat).join(', ') : 
                        'Seat selection completed',
                    eventDate: item.start_date ? 
                        formatSmartDate(item.start_date) : 'Date TBD',
                    eventTime: item.start_date ? 
                        formatSmartDate(item.start_date, true).split(' • ')[1] || 'Time TBD' : 'Time TBD',
                    ticketId: ticketId, // Add ticket ID
                    status: activeTab,
                    booking: item.booking,
                    event: item
                }
            } 
        });
    };

    const handleCancelTicket = async (bookingId: string) => {
        setTicketToCancel(bookingId);
        setCancelDialogOpen(true);
    };

    const confirmCancelTicket = async () => {
        if (!ticketToCancel) return;
        
        updateBookingStatusMutation.mutate(
            { id: ticketToCancel, data: { status: 'cancelled' } },
            {
                onSuccess: () => {
                    showSuccess('Ticket cancelled successfully!');
                    setCancelDialogOpen(false);
                    setTicketToCancel(null);
                },
                onError: (error) => {
                    console.error('Error cancelling ticket:', error);
                    showError('Failed to cancel ticket. Please try again.');
                }
            }
        );
    };

    const handleCancelDialogClose = () => {
        setCancelDialogOpen(false);
        setTicketToCancel(null);
    };

    const getTicketsByStatus = (status: string) => {
        const now = new Date();
        
        if (status === 'upcoming') {
            return matchedItems.filter(item => {
                if (item?.booking?.status === 'cancelled' || item?.booking?.status === 'completed') return false;
                
                // Check if event date is in the future
                const eventDate = item?.start_date;
                if (!eventDate) return false;
                
                return new Date(eventDate) > now;
            });
        } else if (status === 'cancelled') {
            return matchedItems.filter(item => item?.booking?.status === 'cancelled');
        } else if (status === 'completed') {
            return matchedItems.filter(item => {
                if (item?.booking?.status === 'cancelled') return false;
                
                // Check if event date has passed
                const eventDate = item?.start_date;
                if (!eventDate) return false;
                
                return new Date(eventDate) <= now;
            });
        } else if (status === 'refunded') {
            return matchedItems.filter(item => item?.booking?.status === 'refunded');
        }
        return matchedItems;
    };

    const isLoading = bookingsLoading;

    // Guest mode check - show sign-in prompt if no user
    if (!authUser) {
        return (
            <>
                <Box className='absolute right-4 top-4 z-10'>
                    <ThemeToggle />
                </Box>
                <Container className='relative min-h-screen flex items-center justify-center'>
                    <Box className="flex flex-col items-center gap-4 text-center">
                        <Typography variant="h5" className="font-semibold text-blue-500 dark:text-blue-400">
                            Please sign in to view your tickets
                        </Typography>
                        <Button 
                            onClick={() => navigate('/auth/sign-in')} 
                            variant='contained'
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold h-12 px-8"
                        >
                            Sign In
                        </Button>
                    </Box>
                    <BottomAppBar />
                </Container>
            </>
        );
    }

    return (
        <>
            <Box className='absolute right-4 top-4 z-10'>
                <ThemeToggle />
            </Box>
            <Container className='relative min-h-screen'>
                <PageHeader 
                    title="Your Tickets"
                    showBackButton={true}
                    showMenuButton={false}
                />
            
            {/* Status Tabs */}
            <Box className='w-full overflow-x-auto no-scrollbar mb-6'>
                <ButtonGroup className='w-full font-header font-semibold text-xs px-1 py-0.5'>
                    <Button 
                        variant={activeTab === 'upcoming' ? 'contained' : 'outlined'}
                        onClick={() => handleTabChange('upcoming')}
                        className={activeTab === 'upcoming' ? 'bg-primary text-white' : 'bg-neutral-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}
                        size='small'
                    >
                        Upcoming ({getTicketsByStatus('upcoming').length})
                    </Button>
                    <Button 
                        variant={activeTab === 'completed' ? 'contained' : 'outlined'}
                        onClick={() => handleTabChange('completed')}
                        className={activeTab === 'completed' ? 'bg-primary text-white' : 'bg-neutral-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}
                        size='small'
                    >
                        Completed ({getTicketsByStatus('completed').length})
                    </Button>
                    <Button 
                        variant={activeTab === 'cancelled' ? 'contained' : 'outlined'}
                        onClick={() => handleTabChange('cancelled')}
                        className={activeTab === 'cancelled' ? 'bg-primary text-white' : 'bg-neutral-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}
                        size='small'
                    >
                        Cancelled ({getTicketsByStatus('cancelled').length})
                    </Button>
                </ButtonGroup>
            </Box>
            
            {/* Scrollable ticket cards list */}
            <Box className='flex-1 overflow-y-auto no-scrollbar'>
                {getTicketsByStatus(activeTab).length > 0 ? (
                    getVisibleItems(getTicketsByStatus(activeTab)).map(item => (
                        <Box key={item?.id} className='mb-6 cursor-pointer' onClick={() => handleEventClick(item)}>
                            <Box className='flex justify-center'>
                                <Box className='relative scale-90 origin-center'>
                                    <TicketCard
                                        imageUrl={item?.image || '/illustrations/eventcard.png'}
                                        eventName={item?.title || 'Event Name'}
                                        eventLocation={item?.location || 'Location TBD'}
                                        seatNumber={(item?.booking as any)?.selected_seats?.length > 0 ? 
                                            (item?.booking as any).selected_seats.map((seat: any) => seat.seat).join(', ') : 
                                            'Seat selection completed'}
                                        eventDate={item?.type === 'event' ? 
                                            ((item as any)?.start_date ? formatSmartDate((item as any).start_date) : 'Date TBD') :
                                            (item?.start_date ? formatSmartDate(item.start_date) : 'Date TBD')}
                                        eventTime={item?.type === 'event' ? 
                                            ((item as any)?.start_date ? formatSmartDate((item as any).start_date, true).split(' • ')[1] || 'Time TBD' : 'Time TBD') :
                                            (item?.start_date ? formatSmartDate(item.start_date, true).split(' • ')[1] || 'Time TBD' : 'Time TBD')}
                                        ticketId={(item?.booking as any)?.booking_id || (item?.booking as any)?.id}
                                    />
                                    
                                    {/* Status indicator */}
                                    <Box className='absolute top-2 right-6 z-10 scale-90 origin-top-right'>
                                        <Box className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            item?.booking?.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                            item?.booking?.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        }`}>
                                            {item?.booking?.status === 'cancelled' ? 'Cancelled' :
                                             item?.booking?.status === 'completed' ? 'Completed' :
                                             'Upcoming'}
                                        </Box>
                                    </Box>

                                    {/* Cancel button for upcoming events only */}
                                    {item?.booking?.status !== 'cancelled' && item?.booking?.status !== 'completed' && (
                                        <Box className='absolute top-2 left-6 z-10 scale-90 origin-top-left'>
                                            <Button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCancelTicket(item?.booking?.id || '');
                                                }}
                                                size='small'
                                                variant='outlined'
                                                className='bg-white/95 hover:bg-white text-red-600 border-red-300 hover:border-red-500 hover:text-red-700 text-xs px-2 py-0.5 min-w-0 h-7'
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Box className='text-center py-12'>
                        <Typography variant='h6' className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} mb-4`}>
                            No tickets found
                        </Typography>
                    </Box>
                )}

                {hasMore(getTicketsByStatus(activeTab).length) && (
                    <Box className='mt-4 flex justify-center'>
                        <Button
                            variant='outlined'
                            onClick={loadMore}
                            className='text-primary border-primary hover:border-primary-light hover:bg-primary/10'
                        >
                            Load More ({getRemainingCount(getTicketsByStatus(activeTab).length)} remaining)
                        </Button>
                    </Box>
                )}
            </Box>

            <BottomAppBar />
            
            {/* Confirmation Dialog */}
            <Dialog 
                open={cancelDialogOpen} 
                onClose={handleCancelDialogClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Cancel Ticket
                </DialogTitle>
                <DialogContent>
                    <Typography className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        Are you sure you want to cancel this ticket? This action cannot be undone and you may not be eligible for a refund.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleCancelDialogClose}
                        className="text-neutral-600 hover:text-neutral-800"
                    >
                        Keep Ticket
                    </Button>
                    <Button 
                        onClick={confirmCancelTicket}
                        variant="contained"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={updateBookingStatusMutation.isPending}
                    >
                        {updateBookingStatusMutation.isPending ? 'Cancelling...' : 'Cancel Ticket'}
                    </Button>
                </DialogActions>
            </Dialog>
            </Container>
        </>
    );
}

export default Tickets;
