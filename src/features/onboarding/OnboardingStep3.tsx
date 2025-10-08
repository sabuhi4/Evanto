import React from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Button } from '@mui/material';
import { Container } from '@mui/material';
import Onboarding3 from '/illustrations/onboarding3.png';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

function OnboardingStep3() {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    
    return (
        <Container className="relative min-h-screen">
            <Box className='flex-1 flex flex-col justify-center w-full'>
                <Box className='flex justify-center mb-8 w-full'>
                    <img src={Onboarding3} alt='Onboarding' className='h-48 w-48' />
                </Box>
                
                <Typography 
                    variant="h4"
                    className={`font-jakarta font-bold mb-4 text-left w-full ${isDarkMode ? 'text-white' : 'text-blue-500'}`}
                >
                    Seize every moment
while it's still in your
grasp.
                </Typography>
                
                <Typography 
                    variant="body1"
                    className={`font-jakarta mb-6 text-left w-full ${isDarkMode ? 'text-neutral-300' : 'text-neutral-500'}`}
                >
                    Now it's very easy to create, host and manage your event with collaboration.
                </Typography>
                
                <Box className='flex justify-center mb-8 w-full'>
                <Stepper 
                    activeStep={2} 
                    alternativeLabel
                    sx={{
                        '& .MuiStepLabel-root': {
                            cursor: 'pointer',
                        },
                        '& .MuiStepLabel-iconContainer': {
                            cursor: 'pointer',
                        }
                    }}
                >
                    <Step onClick={() => navigate('/onboarding/step-1')}>
                        <StepLabel />
                    </Step>
                    <Step onClick={() => navigate('/onboarding/step-2')}>
                        <StepLabel />
                    </Step>
                    <Step onClick={() => navigate('/onboarding/step-3')}>
                        <StepLabel />
                    </Step>
                </Stepper>
                </Box>
            </Box>
            
            <Box className='w-full pb-8'>
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/welcome')}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-jakarta font-semibold mb-4 h-12"
                >
                    Let's Go!
                </Button>
            
                <Box className='text-center w-full'>
                    <Typography 
                        variant="caption"
                        className={`font-jakarta cursor-pointer ${isDarkMode ? 'text-white' : 'text-blue-500'}`}
                        onClick={() => navigate('/home')}
                    >
                        Skip
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default OnboardingStep3;

