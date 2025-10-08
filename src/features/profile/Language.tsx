import { Container } from '@mui/material';
import { Box, List, ListItem, ListItemIcon, ListItemText, Radio, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { PageHeader } from '@/components/layout/PageHeader';
import { BottomAppBar } from '@/components/navigation/BottomAppBar';

function Language() {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const [selectedLanguage, setSelectedLanguage] = useState('English (US)');

    const handleBack = () => {
        navigate(-1);
    };

    const handleLanguageSelect = (language: string) => {
        setSelectedLanguage(language);
    };

    const suggestedLanguages = [
        'English (US)',
        'English (UK)'
    ];

    const allLanguages = [
        'Azerbaijani',
        'Mandarin',
        'Russian',
        'Spanish',
        'French',
        'Arabic',
        'Bengali',
        'Indonesian'
    ];

    return (
        <>
            <Container className='relative min-h-screen'>
                <PageHeader 
                    title="Language"
                    showBackButton={true}
                    showMenuButton={false}
                    onBackClick={handleBack}
                    className="mb-8"
                />
                
                <Box className='flex flex-col gap-6'>
                    <Typography variant='h4' className={`self-start ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                        Suggested
                    </Typography>
                    <Box className='w-full rounded-2xl bg-neutral-50 dark:bg-gray-800'>
                        <List dense>
                            {suggestedLanguages.map((language) => (
                                <ListItem 
                                    key={language}
                                    component='button'
                                    onClick={() => handleLanguageSelect(language)}
                                    className='hover:bg-neutral-100 dark:hover:bg-gray-700'
                                >
                                    <ListItemText primary={language} className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                                    <ListItemIcon>
                                        <Radio 
                                            size='small' 
                                            checked={selectedLanguage === language}
                                            className='text-primary'
                                        />
                                    </ListItemIcon>
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    <Typography variant='h4' className={`self-start ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                        All Languages
                    </Typography>
                    <Box className='w-full rounded-2xl bg-neutral-50 dark:bg-gray-800'>
                        <List dense>
                            {allLanguages.map((language) => (
                                <ListItem 
                                    key={language}
                                    component='button'
                                    onClick={() => handleLanguageSelect(language)}
                                    className='hover:bg-neutral-100 dark:hover:bg-gray-700'
                                >
                                    <ListItemText primary={language} className={`${isDarkMode ? 'text-white' : 'text-neutral-900'}`} />
                                    <ListItemIcon>
                                        <Radio 
                                            size='small' 
                                            checked={selectedLanguage === language}
                                            className='text-primary'
                                        />
                                    </ListItemIcon>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Box>

                <BottomAppBar />
            </Container>
        </>
    );
}

export default Language;

