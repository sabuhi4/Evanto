import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CongratulationIcon from '@/assets/icons/congratulationsillustrations.svg?react';
import { Container } from '@mui/material';

function Congratulation() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const context = location.state?.context || 'default';
    const bookingId = location.state?.bookingId;
    
    const getMessage = () => {
        switch (context) {
            case 'booking':
                return {
                    title: 'Booking Confirmed!',
                    message: `Your event has been successfully booked! Your booking ID is: ${bookingId || 'N/A'}. You will be redirected to the home page in a few seconds.`,
                    buttonText: 'Back To Home',
                    redirectPath: '/'
                };
            case 'password':
                return {
                    title: 'Password Updated!',
                    message: 'Your password has been successfully updated. Your account is now secure and ready to use. You will be redirected to the home page in a few seconds.',
                    buttonText: 'Back To Home',
                    redirectPath: '/'
                };
            case 'account':
                return {
                    title: 'Account Created!',
                    message: 'Your account has been successfully created. Welcome to Evanto! You will be redirected to the home page in a few seconds.',
                    buttonText: 'Get Started',
                    redirectPath: '/home'
                };
            default:
                return {
                    title: 'Congratulations!',
                    message: 'Your action has been completed successfully. You will be redirected to the home page in a few seconds.',
                    buttonText: 'Back To Home',
                    redirectPath: '/'
                };
        }
    };

    const messageConfig = getMessage();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(messageConfig.redirectPath);
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate, messageConfig.redirectPath]);

    return (
        <Container className='relative'>
            <Box className='absolute inset-0 z-10 flex items-center justify-center bg-black/15 backdrop-blur-md'>
                <Box className='w-80 rounded-3xl border border-gray-200 bg-white p-6 shadow-lg'>
                    <Box className='flex flex-col items-center space-y-6 text-center'>
                        <CongratulationIcon className='mx-auto' />
                        <Typography variant='h2'>{messageConfig.title}</Typography>
                        <Typography variant='body2'>
                            {messageConfig.message}
                        </Typography>
                        <Button 
                            variant='contained' 
                            onClick={() => navigate(messageConfig.redirectPath)}
                        >
                            {messageConfig.buttonText}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default Congratulation;
