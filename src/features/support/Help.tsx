import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Divider,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useUserStore } from '@/store/userStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { BottomAppBar } from '@/components/navigation/BottomAppBar';

type TabType = 'general' | 'account' | 'services' | 'payment';

function Help() {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const [activeTab, setActiveTab] = useState<TabType>('general');

    const handleBack = () => {
        navigate(-1);
    };

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
    };

    const getTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <Box className='flex flex-col gap-3'>
                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    What is Evanto?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                Evanto is your ultimate platform for discovering and booking events and meetups. Connect with like-minded people and explore exciting experiences in your area.
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    How do I exit the app?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                You can sign out from the Profile page or close the app using your device's standard methods. Your data will be saved for your next session.
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    Why are Evanto prices different?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                Prices may vary based on event type, location, demand, and organizer pricing. We strive to provide competitive rates while ensuring quality experiences.
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                );
            case 'account':
                return (
                    <Box className='flex flex-col gap-3'>
                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    How do I create an account?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                You can create an account by signing up with your email address or using social login options like Google or Apple.
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    How do I delete my account?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                You can delete your account from the Settings page. This action is irreversible and will remove all your data from our platform.
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    How do I change my password?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                You can change your password from the Settings page by going to "Change Password" and following the verification process.
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                );
            case 'services':
                return (
                    <Box className='flex flex-col gap-3'>
                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    How do I book an event?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                Browse events on the home page or search for specific events. Click on an event to view details, then follow the booking process to secure your spot.
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    How do I cancel a booking?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                You can cancel your booking from the Tickets section in your profile. Cancellation policies vary by event, so please check the specific terms before booking.
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    How do I create my own event?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                Go to the "Create Event" option in your profile menu. Fill out the event details, set pricing, and publish your event to start accepting bookings.
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                );
            case 'payment':
                return (
                    <Box className='flex flex-col gap-3'>
                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    How to make a payment?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                You can make payments using credit cards, debit cards, or digital wallets. All transactions are secure and encrypted for your protection.
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    Why can't I add a new payment method?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                Please ensure your payment method is valid and supported. Contact support if you continue to experience issues adding payment methods.
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={`overflow-hidden !rounded-3xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                            <AccordionSummary expandIcon={<ExpandMore className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />}>
                                <Typography component={'span'} className={`font-header text-sm font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                                    Are my payment details secure?
                                </Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails className={`font-header text-xs font-medium ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                                Yes, all payment information is encrypted and processed securely. We use industry-standard security measures to protect your financial data.
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Container className='relative min-h-screen'>
                <PageHeader 
                    title="Help Center"
                    showBackButton={true}
                    showMenuButton={false}
                    onBackClick={handleBack}
                    className="mb-8"
                />

                <Box className='flex flex-col gap-6'>
                    <Stack direction={'row'} spacing={1} className='w-full overflow-hidden'>
                        <Button 
                            variant='contained' 
                            className={`h-9 font-jakarta text-xs font-bold ${activeTab === 'general' ? (isDarkMode ? 'bg-primary text-white' : 'bg-primary text-white') : (isDarkMode ? 'bg-gray-700 text-white' : 'bg-neutral-200 text-neutral-700')}`}
                            onClick={() => handleTabChange('general')}
                        >
                            General
                        </Button>
                        <Button 
                            variant='contained' 
                            className={`h-9 font-jakarta text-xs font-bold ${activeTab === 'account' ? (isDarkMode ? 'bg-primary text-white' : 'bg-primary text-white') : (isDarkMode ? 'bg-gray-700 text-white' : 'bg-neutral-200 text-neutral-700')}`}
                            onClick={() => handleTabChange('account')}
                        >
                            Account
                        </Button>
                        <Button 
                            variant='contained' 
                            className={`h-9 font-jakarta text-xs font-bold ${activeTab === 'services' ? (isDarkMode ? 'bg-primary text-white' : 'bg-primary text-white') : (isDarkMode ? 'bg-gray-700 text-white' : 'bg-neutral-200 text-neutral-700')}`}
                            onClick={() => handleTabChange('services')}
                        >
                            Services
                        </Button>
                        <Button 
                            variant='contained' 
                            className={`h-9 font-jakarta text-xs font-bold ${activeTab === 'payment' ? (isDarkMode ? 'bg-primary text-white' : 'bg-primary text-white') : (isDarkMode ? 'bg-gray-700 text-white' : 'bg-neutral-200 text-neutral-700')}`}
                            onClick={() => handleTabChange('payment')}
                        >
                            Payment
                        </Button>
                    </Stack>


                    {getTabContent()}
                </Box>

                <BottomAppBar />
            </Container>
        </>
    );
}

export default Help;

