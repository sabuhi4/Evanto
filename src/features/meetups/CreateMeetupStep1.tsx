import React, { useState } from 'react';
import { Box, Typography, Button, TextField, IconButton, Container } from '@mui/material';
import { KeyboardArrowLeft, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '@/store/dataStore';
import { useUserStore } from '@/store/userStore';

function CreateMeetupStep1() {
    const navigate = useNavigate();
    const { updateMeetupCreation, setMeetupCreationStep } = useDataStore();
    const [name, setNameLocal] = useState('');
    const isDarkMode = useUserStore(state => state.isDarkMode);

    const handleNext = () => {
        if (name.trim()) {
            updateMeetupCreation({ title: name.trim() });
            setMeetupCreationStep(2);
            navigate('/meetups/create/step-2');
        }
    };

    return (
        <>
            
            <Container className="relative min-h-screen">
            <Box className='mb-8 flex w-full items-center justify-between'>
                    <IconButton size='medium' onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400 border border-neutral-200 bg-gray-100 dark:bg-gray-700">
                    <KeyboardArrowLeft />
                </IconButton>
                <Typography variant='h4' className="font-jakarta font-semibold text-blue-500 dark:text-blue-400">Create Meetup</Typography>
                <Box className='w-10' />
            </Box>

            <Box className='mb-6'>
                <Typography variant='h5' className="mb-2 font-jakarta font-semibold text-blue-500 dark:text-blue-400">What's your meetup called?</Typography>
                <Typography variant='body2' className="mb-4 font-jakarta text-gray-600 dark:text-gray-400">
                    Choose a name that will help people understand what your meetup is about.
                </Typography>
                <TextField
                    fullWidth
                    placeholder='Enter meetup name...'
                    value={name}
                    onChange={(e) => setNameLocal(e.target.value)}
                    variant='outlined'
                                            size='medium'
                />
            </Box>

            <Box className='mt-auto'>
                <Button
                    fullWidth
                    variant='contained'
                    onClick={handleNext}
                    disabled={!name.trim()}
                >
                    Continue
                </Button>
            </Box>
            </Container>
        </>
    );
}

export default CreateMeetupStep1;


