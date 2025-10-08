import React from 'react';
import { Box, Typography, CardMedia } from '@mui/material';
import { LocationOn, CalendarToday, AccessTime, EventSeat } from '@mui/icons-material';
import { useUserStore } from '@/store/userStore';

interface TicketCardProps {
    imageUrl: string;
    eventName: string;
    eventLocation: string;
    eventDate: string;
    eventTime: string;
    seatNumber: string;
    ticketNumber?: string;
    ticketId?: string;
}

const TicketCard = ({ imageUrl, eventName, eventTime, eventLocation, eventDate, seatNumber, ticketNumber, ticketId }: TicketCardProps) => {
    const isDarkMode = useUserStore(state => state.isDarkMode);
    
    const TicketLabel = ({ children }: { children: React.ReactNode }) => (
        <Typography variant='caption' className={`font-medium text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {children}
        </Typography>
    );
    
    const TicketValue = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
        <Typography variant='body2' className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-neutral-900'} ${className}`}>
            {children}
        </Typography>
    );

    return (
        <Box 
            className={`relative w-80 h-[28rem] rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isDarkMode ? 'bg-gradient-to-br from-neutral-800 to-neutral-900' : 'bg-gradient-to-br from-white to-neutral-50'}`}
        >
            <Box className={`absolute top-0 left-0 right-0 h-1 ${isDarkMode ? 'bg-neutral-700' : 'bg-neutral-200'}`}>
                <Box className='flex justify-center'>
                    <Box className={`w-8 h-1 rounded-full ${isDarkMode ? 'bg-neutral-800' : 'bg-white'}`}></Box>
                </Box>
            </Box>
            
            <Box className='p-6 pt-8 flex flex-col h-full'>
                <CardMedia 
                    component='img' 
                    src={imageUrl} 
                    alt={eventName} 
                    className='w-full h-20 rounded-xl object-cover mb-4 border-2 border-white/20' 
                />
                
                <Typography variant='h6' className={`text-center font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    {eventName}
                </Typography>
                
                <Box className='space-y-5 flex-1'>
                    <Box className='flex items-center gap-3'>
                        <LocationOn className={`text-lg ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <Box className='flex-1'>
                            <TicketLabel>Location</TicketLabel>
                            <TicketValue>{eventLocation}</TicketValue>
                        </Box>
                    </Box>
                    
                    <Box className='flex gap-4'>
                        <Box className='flex items-center gap-3 flex-1'>
                            <CalendarToday className={`text-lg ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                            <Box className='flex-1'>
                                <TicketLabel>Date</TicketLabel>
                                <TicketValue>{eventDate}</TicketValue>
                            </Box>
                        </Box>
                        <Box className='flex items-center gap-3 flex-1'>
                            <AccessTime className={`text-lg ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                            <Box className='flex-1'>
                                <TicketLabel>Time</TicketLabel>
                                <TicketValue>{eventTime}</TicketValue>
                            </Box>
                        </Box>
                    </Box>
                    
                    <Box className={`p-4 rounded-lg ${isDarkMode ? 'bg-neutral-700/50' : 'bg-blue-50'} border ${isDarkMode ? 'border-neutral-600' : 'border-blue-200'}`}>
                        <Box className='flex items-center gap-3'>
                            <EventSeat className={`text-lg ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            <Box className='flex-1'>
                                <TicketLabel>Seat Number</TicketLabel>
                                <TicketValue className={`${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>{seatNumber}</TicketValue>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                
                {ticketId && (
                    <Box className='mt-auto pt-4'>
                        <Typography variant='caption' className={`text-center block ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            Ticket ID: {ticketId}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};
export default TicketCard;

