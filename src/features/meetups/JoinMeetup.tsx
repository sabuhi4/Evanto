import React, { useState } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useUnifiedItems } from '@/hooks/useUnifiedItems';
import { getSeatAvailability } from '@/services/dataService';
import { useUserStore } from '@/store/userStore';
import { createBooking } from '@/services/dataService';
import { showSuccess, showError } from '@/utils/notifications';

function JoinMeetup() {
    const navigate = useNavigate();
    const { id: meetupId } = useParams();
    const user = useUserStore(state => state.user);
    const [isJoining, setIsJoining] = useState(false);
    const isDarkMode = useUserStore(state => state.isDarkMode);

    const { data: items = [] } = useUnifiedItems();

    const meetup = items.find(i => i.id === meetupId && i.type === 'meetup');

    const { data: availability } = useQuery({
        queryKey: ['meetupAvailability', meetupId],
        queryFn: () => getSeatAvailability(meetupId!, meetup?.max_participants),
        enabled: !!meetupId && !!meetup,
    });

    const handleJoinMeetup = async () => {
        if (!user?.id || !meetup) {
            showError('User not authenticated or meetup not found');
            return;
        }

        if (availability?.isFullyBooked) {
            showError('This meetup is full');
            return;
        }

        setIsJoining(true);

        try {
            await createBooking({
                user_id: user.id,
                event_id: meetup.id,
                order_number: `MEETUP-${Date.now()}`,
                total_amount: 0, // Meetups are free
                status: 'confirmed', // Auto-confirm meetups
                payment_status: 'paid', // No payment needed
                selected_seats: [], // No seats for meetups
            });

            showSuccess('Successfully joined the meetup!');
            navigate('/home');
        } catch (error: any) {
            console.error('Error joining meetup:', error);
            showError(error.message || 'Failed to join meetup');
        } finally {
            setIsJoining(false);
        }
    };

    if (!meetup) {
        return (
            <Container className="relative min-h-screen">
                <Typography variant="h6">Meetup not found</Typography>
                <Button onClick={() => navigate('/home')} className="mt-4">
                    Back to Home
                </Button>
            </Container>
        );
    }

    return (
        <>
            
            <Container className="relative min-h-screen">
                <Box className='mb-8 flex w-full items-center justify-between'>
                    <IconButton size='medium' onClick={() => navigate(-1)} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} border border-neutral-200 bg-gray-100 dark:bg-gray-700`} sx={{ borderRadius: '50%' }}>
                        <KeyboardArrowLeft />
                    </IconButton>
                    <Typography variant='h4' className={`font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Join Meetup
                    </Typography>
                    <Box className='w-10' />
                </Box>

                <Box className="mb-8">
                    <Typography variant="h5" className={`mb-4 font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {meetup.title}
                    </Typography>
                    <Typography variant="body1" className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {meetup.description}
                    </Typography>
                    <Typography variant="body2" className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <strong>Date:</strong> {new Date(meetup.start_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <strong>Category:</strong> {meetup.category}
                    </Typography>
                    {meetup.max_participants && (
                        <Typography variant="body2" className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <strong>Capacity:</strong> {availability?.availableSeats || meetup.max_participants} / {meetup.max_participants} participants
                        </Typography>
                    )}
                </Box>

                {availability?.isFullyBooked ? (
                    <Box className="text-center py-8">
                        <Typography variant="h6" color="error" className="mb-2">
                            This meetup is full
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            All spots have been taken.
                        </Typography>
                    </Box>
                ) : (
                    <Box className="mt-auto">
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleJoinMeetup}
                            disabled={isJoining}
                            className="font-jakarta h-12 text-base font-medium"
                            sx={{
                                backgroundColor: '#5D9BFC',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#4A8BFC',
                                },
                                '&:disabled': {
                                    backgroundColor: '#E5E7EB',
                                    color: '#9CA3AF',
                                }
                            }}
                        >
                            {isJoining ? 'Joining...' : 'Join Meetup'}
                        </Button>
                    </Box>
                )}
            </Container>
        </>
    );
}

export default JoinMeetup;

