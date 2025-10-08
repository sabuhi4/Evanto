import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import { useUserStore } from '@/store/userStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { BottomAppBar } from '@/components/navigation/BottomAppBar';

function Privacy() {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Container className='relative min-h-screen pb-32'>
                <PageHeader
                    title="Privacy Policy"
                    showBackButton={true}
                    showMenuButton={false}
                    onBackClick={handleBack}
                    className="mb-8"
                />

                <Box className='flex flex-col gap-6 h-[calc(100vh-200px)] overflow-y-auto'>
                    <Typography variant='body1' className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        Welcome to <strong className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>Evanto</strong> - your all-in-one solution for discovering and booking events and meetups. We are committed to protecting your privacy and ensuring the security of your personal information.
                    </Typography>

                    <Typography variant='h5' className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                        Information We Collect
                    </Typography>
                    <Typography variant='body1' className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        <strong className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>1. Personal Information:</strong> We collect information you provide directly to us, such as when you create an account, book events, or contact us for support. This may include your name, email address, phone number, and payment information.
                    </Typography>
                    <Typography variant='body1' className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        <strong className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>2. Usage Information:</strong> We automatically collect certain information about your use of our services, including your device information, IP address, browser type, and how you interact with our platform.
                    </Typography>
                    <Typography variant='body1' className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        <strong className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>3. Location Data:</strong> With your permission, we may collect location information to help you discover events and meetups in your area.
                    </Typography>

                    <Typography variant='h5' className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                        How We Use Your Information
                    </Typography>
                    <Typography variant='body1' className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        We use the information we collect to provide, maintain, and improve our services, process transactions, send you notifications about events you're interested in, and communicate with you about our services.
                    </Typography>

                    <Typography variant='h5' className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                        Information Sharing
                    </Typography>
                    <Typography variant='body1' className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy. We may share your information with event organizers when you book their events, and with service providers who assist us in operating our platform.
                    </Typography>

                    <Typography variant='h5' className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                        Data Security
                    </Typography>
                    <Typography variant='body1' className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted and processed securely.
                    </Typography>

                    <Typography variant='h5' className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                        Your Rights
                    </Typography>
                    <Typography variant='body1' className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us. To exercise these rights, please contact us through the app or at our support email.
                    </Typography>

                    <Typography variant='h5' className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                        Changes to This Policy
                    </Typography>
                    <Typography variant='body1' className={`${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
                    </Typography>

                    <Typography variant='body2' className={`${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'} mt-4`}>
                        Last Updated: {new Date().toLocaleDateString()}
                    </Typography>
                </Box>

                <BottomAppBar />
            </Container>
        </>
    );
}

export default Privacy;

