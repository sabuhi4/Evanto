import React, { useState } from 'react';
import { Box, Typography, Button, TextField, IconButton, MenuItem, Container } from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '@/store/dataStore';
import { useUserStore } from '@/store/userStore';
import { useFiltersStore } from '@/store/filtersStore';

function CreateMeetupStep2() {
    const navigate = useNavigate();
    const { updateMeetupCreation, setMeetupCreationStep } = useDataStore();
    const [date, setDateLocal] = useState('');
    const [category, setCategoryLocal] = useState('Other');
    const [maxParticipants, setMaxParticipantsLocal] = useState('');
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const { categories } = useFiltersStore();

    const handleNext = () => {
        if (date && category) {
            updateMeetupCreation({
                start_date: new Date(date).toISOString(),
                category: category,
                max_participants: maxParticipants ? parseInt(maxParticipants) : null,
            });
            setMeetupCreationStep(3);
            navigate('/meetups/create/step-3');
        }
    };

    const handleBack = () => {
        setMeetupCreationStep(1);
        navigate('/meetups/create/step-1');
    };

    return (
        <>
            
            <Container className="relative min-h-screen">
            <Box className='mb-8 flex w-full items-center justify-between'>
                <IconButton onClick={handleBack} className="">
                    <KeyboardArrowLeft />
                </IconButton>
                <Typography variant='h4' className='font-jakarta font-semibold text-blue-500 dark:text-blue-400'>Create Meetup</Typography>
                <Box className='w-10' />
            </Box>

            <Box className='mb-6'>
                <Typography variant='h5' className={`mb-2 font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>When is your meetup?</Typography>
                <Typography variant='body2' className={`mb-4 font-poppins ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Choose a date and time that works for your audience.
                </Typography>
                <TextField
                    fullWidth
                    type='datetime-local'
                    value={date}
                    onChange={(e) => setDateLocal(e.target.value)}
                    variant='outlined'
                    size='medium'
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>

            <Box className='mb-6'>
                <Typography variant='h5' className={`mb-2 font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>What category?</Typography>
                <Typography variant='body2' className={`mb-4 font-poppins ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Choose a category that best describes your meetup.
                </Typography>
                <TextField
                    fullWidth
                    select
                    value={category}
                    onChange={(e) => setCategoryLocal(e.target.value)}
                    variant='outlined'
                    size='medium'
                >
                    {categories.filter(cat => cat.name !== 'All').map((category) => (
                        <MenuItem key={category.name} value={category.name}>
                            {category.name}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <Box className='mb-6'>
                <Typography variant='h5' className={`mb-2 font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Max participants (optional)</Typography>
                <Typography variant='body2' className={`mb-4 font-poppins ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Set a limit on how many people can join. Leave empty for unlimited.
                </Typography>
                <TextField
                    fullWidth
                    type='number'
                    placeholder='e.g., 50'
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipantsLocal(e.target.value)}
                    variant='outlined'
                    size='medium'
                    inputProps={{ min: 1 }}
                />
            </Box>

            <Box className='mt-auto'>
                <Button
                    fullWidth
                    variant='contained'
                    onClick={handleNext}
                    disabled={!date || !category}
                >
                    Continue
                </Button>
            </Box>
            </Container>
        </>
    );
}

export default CreateMeetupStep2;


