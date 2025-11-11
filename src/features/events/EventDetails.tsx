import React from 'react';
import { Avatar, AvatarGroup, Box, Button, Divider, IconButton, Typography, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { ArrowCircleLeft, PlayArrow } from '@mui/icons-material';
import { CalendarMonth, LocationOn, Favorite, ArrowBack } from '@mui/icons-material';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Link } from 'react-router-dom';
import { useFavorite } from '@/hooks/useFavorite';
import { useUserStore } from '@/store/userStore';
import { showSuccess } from '@/utils/notifications';
import { useUser } from '@/hooks/useData';
import { getAvatarProps } from '@/utils/avatarUtils';
import type { UnifiedItem } from '@/utils/schemas';
import { generateICalFile, downloadCalendarFile } from '@/utils/calendar';

function EventDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const event = location.state?.event;
    
    // Ensure event has type field - fallback to 'event' if not set
    const eventWithType: UnifiedItem | null = event ? { ...event, type: event.type || 'event' } : null;
    
    const { isFavorite, toggle, isLoading, isEnabled } = useFavorite(eventWithType?.id?.toString(), eventWithType?.type);
    const [organizerName, setOrganizerName] = useState<string>('Loading...');
    const currentUser = useUserStore(state => state.user);
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const toggleDarkMode = useUserStore(state => state.toggleDarkMode);
    const theme = useTheme();
    
    // Use TanStack Query hook to fetch organizer profile
    const { data: organizerProfile } = useUser(eventWithType?.user_id || '');
    
    useEffect(() => {
        if (organizerProfile?.full_name) {
            setOrganizerName(organizerProfile.full_name);
        } else {
            setOrganizerName(currentUser?.full_name || 'Event Organizer');
        }
    }, [organizerProfile?.full_name, currentUser?.full_name]);

    if (!eventWithType) {
        return (
            <Container>
                <Typography variant="h6" className={`text-center font-jakarta ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No event data found
                </Typography>
                <Button 
                    onClick={() => navigate(-1)}
                    variant="contained"
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-jakarta normal-case"
                >
                    Go Back
                </Button>
            </Container>
        );
    }

    return (
        <>
            <Box className='absolute right-4 top-4 z-10'>
                <ThemeToggle />
            </Box>
            <Container className='relative min-h-screen'>
                <Box className={`no-scrollbar w-full overflow-y-auto`}>
                    <PageHeader 
                        title="Event Details"
                        showBackButton={true}
                        showMenuButton={false}
                        onBackClick={() => navigate('/home')}
                    />

            {/* Image below header */}
            <Box className={'mb-6'}>
                <img src={eventWithType.image || eventWithType.imageUrl || '/illustrations/eventcard.png'} alt={eventWithType.title} className="w-full rounded-2xl" />
            </Box>
            <Box className={'flex w-full items-center justify-between'}>
                <Button 
                    onClick={() => {
                        const eventUrl = `${window.location.origin}/events/${eventWithType.id}`;
                        navigator.clipboard.writeText(eventUrl);
                        showSuccess('Event link copied to clipboard!');
                    }}
                    className={`flex items-center gap-1 px-2 h-8 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5`}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.35064 15.0602 5.68722 15.1707 6M18 8C17.6494 8 17.3128 7.93984 17 7.82929M18 8C18.3506 8 18.6872 8.06016 19 8.17071M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15ZM18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22ZM6 15C6.35064 15 6.68722 14.9398 7 14.8293M6 15C5.64936 15 5.31278 14.9398 5 14.8293M18 22C17.6494 22 17.3128 21.9398 17 21.8293M18 22C18.3506 22 18.6872 21.9398 19 21.8293" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Share Event
                </Button>
                <Box className={'flex flex-col'}>
                    <Typography variant='caption' className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Per Person</Typography>
                    <Typography variant='h6' className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {eventWithType.type === 'event' && eventWithType.ticket_price ? `$${eventWithType.ticket_price}` : 'Free'}
                    </Typography>
                </Box>
            </Box>
            <Typography variant='h2' className={`self-start text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {eventWithType.title}
            </Typography>
            <Box className={'flex w-full items-center justify-between mb-6'}>
                <Box className={'flex items-center gap-2'}>
                    <Avatar {...getAvatarProps(undefined, currentUser, 20)} />
                    <Typography variant='caption' className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Organized by</Typography>
                    <Typography variant='caption' className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-blue-500'}`}>
                        {organizerName}
                    </Typography>
                </Box>
                <IconButton
                    size='large'
                    onClick={() => {
                        if (isEnabled && !isLoading) {
                            toggle();
                        }
                    }}
                    disabled={!isEnabled || isLoading}
                >
                    <Favorite className={`text-lg ${isFavorite ? 'text-red-600' : 'text-white'}`} />
                </IconButton>
            </Box>
            <Divider className='my-6' />
            <Box className={'flex items-center gap-3 self-start mb-4'}>
                <IconButton className="h-10 w-10 rounded-full">
                    <CalendarMonth className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </IconButton>
                <Box>
                    <Typography variant='body1' className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {eventWithType.start_date ? new Date(eventWithType.start_date).toLocaleDateString() : 'Date not specified'}
                    </Typography>
                    <Typography variant='caption' className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {eventWithType.start_date ? new Date(eventWithType.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Time not specified'}
                    </Typography>
                </Box>
            </Box>
            <Button 
                variant='contained' 
                className='h-8 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5 mb-6'
                onClick={() => {
                    const eventData = {
                        title: eventWithType.title,
                        description: eventWithType.description || 'Event description',
                        startDate: eventWithType.start_date ? new Date(eventWithType.start_date) : new Date(),
                        endDate: eventWithType.type === 'event' && eventWithType.end_date ? new Date(eventWithType.end_date) : new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later if no end date
                        location: eventWithType.location || undefined
                    };
                    
                    const icsContent = generateICalFile(eventData);
                    const filename = `${eventWithType.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
                    downloadCalendarFile(icsContent, filename);
                    
                    showSuccess('Calendar file downloaded! Add it to your calendar app.');
                }}
            >
                Add to My Calendar
            </Button>
            {/* Location for Events, Meetup Link for Meetups */}
            {eventWithType.type === 'event' ? (
                <>
                    <Box className={'flex items-center gap-3 self-start mb-4'}>
                        <IconButton className="h-10 w-10 rounded-full">
                            <LocationOn className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </IconButton>
                        <Box>
                            <Typography variant='body1' className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {eventWithType.location}
                            </Typography>
                            <Typography variant='caption' className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {eventWithType.location}
                            </Typography>
                        </Box>
                    </Box>

                    <Button 
                        variant='contained' 
                        className='h-8 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5 mb-6'
                    >
                        Get Location
                    </Button>
                </>
            ) : (
                <>
                    <Box className={'flex items-center gap-3 self-start mb-4'}>
                        <IconButton className="h-10 w-10 rounded-full">
                            <PlayArrow className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </IconButton>
                        <Box>
                            <Typography variant='body1' className={`text-base font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Meetup Link
                            </Typography>
                            <Typography variant='caption' className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {eventWithType.meetup_link || 'No link provided'}
                            </Typography>
                        </Box>
                    </Box>

                    <Button 
                        variant='contained' 
                        className='h-8 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5 mb-6'
                        onClick={() => {
                            if (eventWithType.meetup_link) {
                                navigator.clipboard.writeText(eventWithType.meetup_link);
                                // You can add a toast notification here if you want
                            }
                        }}
                    >
                        Copy Link
                    </Button>
                </>
            )}
            <Box className={'flex w-full items-center mb-6'}>
                <Box className={'flex items-center gap-2'}>
                    {event?.member_avatars && eventWithType.member_avatars.length > 0 && (
                        <>
                            <AvatarGroup max={3}>
                                {eventWithType.member_avatars.map((avatar: string, index: number) => (
                                    <Avatar key={index} src={avatar} alt={`Member ${index + 1}`} className='h-6 w-6' />
                                ))}
                            </AvatarGroup>
                            <Typography variant='caption' className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {eventWithType.member_count || 0}+ Member Joined
                            </Typography>
                        </>
                    )}
                </Box>
            </Box>
            <Typography variant='h4' className={`self-start mb-4 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Description
            </Typography>
            <Box className={`w-full rounded-2xl p-4 min-h-24 ${isDarkMode ? 'bg-white/15 border border-white/20' : 'bg-gray-50 border border-gray-200'}`}>
                <Typography variant='body1' className={`text-sm leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    {eventWithType.description}
                </Typography>
            </Box>
                </Box>
            </Container>
        </>
    );
}

export default EventDetails;

