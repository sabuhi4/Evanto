import { Container } from '@mui/material';
import { Box, List, ListItem, ListItemIcon, ListItemText, Switch, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { BottomAppBar } from '@/components/navigation/BottomAppBar';

function Notification() {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <>
            <Container className='relative min-h-screen'>
                <PageHeader 
                    title="Notifications"
                    showBackButton={true}
                    showMenuButton={false}
                    onBackClick={handleBack}
                    className="mb-8"
                />
                
                <Box className='w-full rounded-2xl bg-neutral-50 dark:bg-gray-800'>
                    <List>
                        <ListItem>
                            <ListItemText primary="Enable Sound & Vibrate" className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                            <ListItemIcon>
                                <Switch size='small' className='[&_.MuiSwitch-thumb]:bg-primary' />
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Purchased Tickets" className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                            <ListItemIcon>
                                <Switch size='small' className='[&_.MuiSwitch-thumb]:bg-primary' />
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Linked Events" className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                            <ListItemIcon>
                                <Switch size='small' className='[&_.MuiSwitch-thumb]:bg-primary' />
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Followed Organiser" className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                            <ListItemIcon>
                                <Switch size='small' className='[&_.MuiSwitch-thumb]:bg-primary' />
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Special Offers" className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                            <ListItemIcon>
                                <Switch size='small' className='[&_.MuiSwitch-thumb]:bg-primary' />
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Payments" className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                            <ListItemIcon>
                                <Switch size='small' className='[&_.MuiSwitch-thumb]:bg-primary' />
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Reminders" className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                            <ListItemIcon>
                                <Switch size='small' className='[&_.MuiSwitch-thumb]:bg-primary' />
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Recommendations" />
                            <ListItemIcon>
                                <Switch size='small' className='[&_.MuiSwitch-thumb]:bg-primary' />
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="App Updates" />
                            <ListItemIcon>
                                <Switch size='small' className='[&_.MuiSwitch-thumb]:bg-primary' />
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="New Services Available" />
                            <ListItemIcon>
                                <Switch size='small' className='[&_.MuiSwitch-thumb]:bg-primary' />
                            </ListItemIcon>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="New Tips Available" />
                            <ListItemIcon>
                                <Switch size='small' className='[&_.MuiSwitch-thumb]:bg-primary' />
                            </ListItemIcon>
                        </ListItem>
                    </List>
                </Box>

                <BottomAppBar />
            </Container>
        </>
    );
}

export default Notification;

