import { Container } from '@mui/material';
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Switch,
    Divider,
} from '@mui/material';
import {
    ChevronRight,
    LanguageOutlined,
    LogoutOutlined,
    NotificationsOutlined,
    PasswordOutlined,
} from '@mui/icons-material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { BottomAppBar } from '@/components/navigation/BottomAppBar';

export const Settings = () => {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const toggleDarkMode = useUserStore(state => state.toggleDarkMode);
    
    // Navigation handlers
    const handleLanguage = () => navigate('/profile/language');
    const handleNotifications = () => navigate('/profile/notifications');
    const handleChangePassword = () => navigate('/profile/change-password');
    
    return (
        <>
            <Container className='relative min-h-screen'>
                <PageHeader 
                    title="Settings"
                    showBackButton={true}
                    showMenuButton={false}
                    className="mb-8"
                />
                
                <Box className='flex flex-col gap-6'>
                    {/* Theme Toggle */}
                    <Box className='w-full rounded-2xl bg-neutral-50 dark:bg-gray-800'>
                        <List>
                            <ListItem>
                                <ListItemText 
                                    primary='Dark Mode' 
                                    secondary={isDarkMode ? 'Enabled' : 'Disabled'}
                                    className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`}
                                />
                                <Switch
                                    checked={isDarkMode}
                                    onChange={toggleDarkMode}
                                    className='text-primary'
                                />
                            </ListItem>
                        </List>
                    </Box>

                    {/* Settings Menu */}
                    <Box className='w-full rounded-2xl bg-neutral-50 dark:bg-gray-800'>
                        <List>
                            <ListItem component='button' onClick={handleNotifications}>
                                <ListItemIcon>
                                    <NotificationsOutlined className='text-primary' />
                                </ListItemIcon>
                                <ListItemText primary='Notifications' className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                                <ChevronRight className='text-neutral-500' />
                            </ListItem>
                            <ListItem component='button' onClick={handleChangePassword}>
                                <ListItemIcon>
                                    <PasswordOutlined className='text-primary' />
                                </ListItemIcon>
                                <ListItemText primary='Change Password' className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                                <ChevronRight className='text-neutral-500' />
                            </ListItem>
                            <ListItem component='button' onClick={handleLanguage}>
                                <ListItemIcon>
                                    <LanguageOutlined className='text-primary' />
                                </ListItemIcon>
                                <ListItemText primary='Language' className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                                <Typography variant='body2' className='mr-1 text-neutral-500'>
                                    English(US)
                                </Typography>
                                <ChevronRight className='text-neutral-500' />
                            </ListItem>
                        </List>
                    </Box>

                    {/* Logout Button */}
                    <Button 
                        variant='contained' 
                        className='w-full h-12 mt-4 bg-red-600 hover:bg-red-700 text-white'
                        startIcon={<LogoutOutlined />}
                    >
                        Log Out
                    </Button>
                </Box>

                <BottomAppBar />
            </Container>
        </>
    );
}


