import React from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { KeyboardArrowLeftOutlined, DeleteOutlineOutlined } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import TicketCard from '@/components/cards/TicketCard';

function TicketDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const ticket = location.state?.ticket;

    const handleBack = () => {
        navigate('/tickets');
    };

    // If no ticket data, show placeholder or redirect
    if (!ticket) {
        return (
            <Container className='relative gap-4 overflow-hidden whitespace-nowrap'>
                <Box className='flex items-center justify-between w-full'>
                    <IconButton 
                        onClick={handleBack}
                        className="text-gray-600 dark:text-gray-400 border border-neutral-200 bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                        <KeyboardArrowLeftOutlined />
                    </IconButton>
                    <Typography variant='h4' className='text-blue-500 dark:text-blue-400'>Ticket Details</Typography>
                    <IconButton className="">
                        <DeleteOutlineOutlined />
                    </IconButton>
                </Box>
                <Box className='text-center py-12'>
                    <Typography variant='h6' className='text-gray-600 dark:text-gray-400 mb-4'>
                        No ticket selected
                    </Typography>
                    <Typography className='text-sm text-gray-600 dark:text-gray-400'>
                        Please go back and select a ticket to view details
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container className='relative min-h-screen'>
            {/* Header */}
            <Box className='flex items-center justify-between w-full'>
                <IconButton 
                    onClick={handleBack}
                    className="text-gray-600 dark:text-gray-400 border border-neutral-200 bg-gray-100 dark:bg-gray-700 rounded-full"
                >
                    <KeyboardArrowLeftOutlined />
                </IconButton>
                <Typography variant='h4'>Ticket Details</Typography>
                <IconButton className="">
                    <DeleteOutlineOutlined />
                </IconButton>
            </Box>
            
            {/* Single ticket card */}
            <Box className='-mx-5 w-full max-w-[375px]'>
                <Box className='overflow-hidden px-5 relative'>
                    <TicketCard
                        imageUrl={ticket.imageUrl}
                        eventName={ticket.eventName}
                        eventLocation={ticket.eventLocation}
                        seatNumber={ticket.seatNumber}
                        eventDate={ticket.eventDate}
                        eventTime={ticket.eventTime}
                        ticketId={ticket.ticketId || ticket.id}
                    />
                    
                    {/* Status indicator */}
                    <Box className='absolute top-2 right-6 z-10'>
                        <Box className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            ticket.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                            {ticket.status === 'upcoming' ? 'Upcoming' :
                             ticket.status === 'completed' ? 'Completed' :
                             'Cancelled'}
                        </Box>
                    </Box>
                </Box>
            </Box>
            
            <Box className='flex-1' />
            
            {/* Action button */}
            <Button 
                variant='contained' 
                className='w-full font-header normal-case'
                sx={{ 
                    backgroundColor: '#5D9BFC',
                    borderRadius: '50px',
                    height: '50px',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    '&:hover': {
                        backgroundColor: '#4A8BEB'
                    }
                }}
            >
                Direction
            </Button>
        </Container>
    );
}

export default TicketDetails;
