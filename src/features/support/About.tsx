import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';
import { useUserStore } from '@/store/userStore';
import LogoLight from '@/assets/icons/logo-light.svg?react';
import LogoDark from '@/assets/icons/logo-dark.svg?react';
import { PageHeader } from '@/components/layout/PageHeader';
import { BottomAppBar } from '@/components/navigation/BottomAppBar';

function About() {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Container className='relative min-h-screen'>
                <PageHeader
                    title="About Evanto"
                    showBackButton={true}
                    showMenuButton={false}
                    onBackClick={handleBack}
                    className="mb-8"
                />

                <Box className='flex flex-col gap-6'>
                    <Box className='flex flex-col items-center gap-4 text-center'>
                        {isDarkMode ? (
                            <LogoDark className="w-24 h-24" />
                        ) : (
                            <LogoLight className="w-24 h-24" />
                        )}
                        <Typography variant='h5' className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                            Evanto Version 1.0.1
                        </Typography>
                        <Typography variant='body2' className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                            Your ultimate platform for discovering and booking events and meetups
                        </Typography>
                    </Box>

                    <Box className='flex flex-col gap-3'>
                        <Button
                            variant='contained'
                            className='justify-between bg-neutral-50 dark:bg-gray-800 hover:bg-neutral-100 dark:hover:bg-gray-700 pl-6 font-jakarta text-sm font-normal text-black dark:text-white'
                            onClick={() => {/* Handle job vacancy */}}
                        >
                            Job Vacancy
                            <KeyboardArrowRight className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
                        </Button>
                        <Button
                            variant='contained'
                            className='justify-between bg-neutral-50 dark:bg-gray-800 hover:bg-neutral-100 dark:hover:bg-gray-700 pl-6 font-jakarta text-sm font-normal text-black dark:text-white'
                            onClick={() => {/* Handle developer */}}
                        >
                            Developer
                            <KeyboardArrowRight className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
                        </Button>
                        <Button
                            variant='contained'
                            className='justify-between bg-neutral-50 dark:bg-gray-800 hover:bg-neutral-100 dark:hover:bg-gray-700 pl-6 font-jakarta text-sm font-normal text-black dark:text-white'
                            onClick={() => {/* Handle partner */}}
                        >
                            Partner
                            <KeyboardArrowRight className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
                        </Button>
                        <Button
                            variant='contained'
                            className='justify-between bg-neutral-50 dark:bg-gray-800 hover:bg-neutral-100 dark:hover:bg-gray-700 pl-6 font-jakarta text-sm font-normal text-black dark:text-white'
                            onClick={() => {/* Handle accessibility */}}
                        >
                            Accessibility
                            <KeyboardArrowRight className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
                        </Button>
                        <Button
                            variant='contained'
                            className='justify-between bg-neutral-50 dark:bg-gray-800 hover:bg-neutral-100 dark:hover:bg-gray-700 pl-6 font-jakarta text-sm font-normal text-black dark:text-white'
                            onClick={() => {/* Handle terms of use */}}
                        >
                            Terms of Use
                            <KeyboardArrowRight className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
                        </Button>
                        <Button
                            variant='contained'
                            className='justify-between bg-neutral-50 dark:bg-gray-800 hover:bg-neutral-100 dark:hover:bg-gray-700 pl-6 font-jakarta text-sm font-normal text-black dark:text-white'
                            onClick={() => {/* Handle feedback */}}
                        >
                            Feedback
                            <KeyboardArrowRight className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
                        </Button>
                        <Button
                            variant='contained'
                            className='justify-between bg-neutral-50 dark:bg-gray-800 hover:bg-neutral-100 dark:hover:bg-gray-700 pl-6 font-jakarta text-sm font-normal text-black dark:text-white'
                            onClick={() => {/* Handle rate us */}}
                        >
                            Rate Us
                            <KeyboardArrowRight className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`} />
                        </Button>
                    </Box>
                </Box>

                <BottomAppBar />
            </Container>
        </>
    );
}

export default About;

