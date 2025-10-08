import React, { useState } from 'react';
import { Box, Typography, Button, TextField, IconButton, Container } from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/notifications';
import { useUserStore } from '@/store/userStore';
import { useDataStore } from '@/store/dataStore';
import { useCreateMeetup } from '@/hooks/useData';

function CreateMeetupStep3() {
    const navigate = useNavigate();
    const user = useUserStore(state => state.user);
    const { meetupCreation, setMeetupCreationStep, resetMeetupCreation } = useDataStore();
    const createMeetupMutation = useCreateMeetup();
    const [description, setDescriptionLocal] = useState('');
    const [link, setLinkLocal] = useState('');
    const isDarkMode = useUserStore(state => state.isDarkMode);

    const handleCreate = async () => {
        if (!description.trim()) {
            showError('Please enter a description');
            return;
        }

        if (!user?.id) {
            showError('User not authenticated');
            return;
        }

        if (!meetupCreation.title || !meetupCreation.start_date || !meetupCreation.category) {
            showError('Missing meetup information. Please go back and complete all steps.');
            return;
        }

        createMeetupMutation.mutate({
            user_id: user.id,
            title: meetupCreation.title,
            start_date: meetupCreation.start_date,
            description: description.trim(),
            meetup_link: link.trim() || null,
            category: meetupCreation.category || 'Other',
            featured: false,
            max_participants: meetupCreation.max_participants,
            type: 'meetup' as const,
            status: 'active',
            member_avatars: [],
            member_count: 0,
        }, {
            onSuccess: () => {
                showSuccess('Meetup created successfully!');
                resetMeetupCreation();
                navigate('/home');
            },
            onError: (error: any) => {
                console.error('Error creating meetup:', error);
                showError('Error creating meetup: ' + error.message);
            }
        });
    };

    const handleBack = () => {
        setMeetupCreationStep(2);
        navigate('/meetups/create/step-2');
    };

    return (
        <>
            
            <Container className="relative min-h-screen">
                <Box className='mb-8 flex w-full items-center justify-between'>
                <IconButton onClick={handleBack} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} border border-neutral-200 bg-gray-100 dark:bg-gray-700`}>
                    <KeyboardArrowLeft />
                </IconButton>
                <Typography variant='h4' className='font-jakarta font-semibold text-primary'>Create Meetup</Typography>
                <Box className='w-10' />
            </Box>

            <Box className='mb-8 w-full'>
                <Typography variant='h5' className={`mb-2 font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Describe your meetup</Typography>
                <Typography variant='body2' className={`mb-4 font-poppins ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Tell people what to expect and why they should join.
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder='Enter meetup description...'
                    value={description}
                    onChange={(e) => setDescriptionLocal(e.target.value)}
                    variant='outlined'
                    size='medium'
                />
            </Box>

            <Box className='mb-8 w-full'>
                <Typography variant='h5' className={`mb-2 font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Meeting link (optional)</Typography>
                <Typography variant='body2' className={`mb-4 font-poppins ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Add a link if this is an online meetup.
                </Typography>
                <TextField
                    fullWidth
                    placeholder='https://meet.google.com/...'
                    value={link}
                    onChange={(e) => setLinkLocal(e.target.value)}
                    variant='outlined'
                    size='medium'
                />
            </Box>

            <Box className='mt-auto'>
                <Button
                    fullWidth
                    variant='contained'
                    onClick={handleCreate}
                    disabled={!description.trim() || createMeetupMutation.isPending}
                >
                    {createMeetupMutation.isPending ? 'Creating...' : 'Create Meetup'}
                </Button>
            </Box>
            </Container>
        </>
    );
}

export default CreateMeetupStep3;


