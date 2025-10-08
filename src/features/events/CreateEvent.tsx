import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography, Button, IconButton, TextField, MenuItem, Container } from '@mui/material';
import { KeyboardArrowLeft, ImageOutlined } from '@mui/icons-material';
import { showSuccess } from '@/utils/notifications';
import { DateTimePicker } from '@/components/forms/DateTimePicker';
import { LocationPicker } from '@/components/forms/LocationPicker';
import { eventSchema } from '@/utils/schemas';
import { z } from 'zod';
import { supabase } from '@/utils/supabase';
import { useUserStore } from '@/store/userStore';
import { useFiltersStore } from '@/store/filtersStore';
import { useCreateEvent } from '@/hooks/useData';
import type { Event } from '@/utils/schemas';

const eventFormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    location: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    ticket_price: z.number().min(0, { message: 'Ticket price can not be negative' }).optional(),
    image: z.any().optional(), // File input returns FileList
    featured: z.boolean(), // Required boolean, no default
    max_participants: z.number().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;
import { showError } from '@/utils/notifications';

const CreateEvent: React.FC = () => {
    const navigate = useNavigate();
    const userId = useUserStore(state => state.user?.id);
    const { categories } = useFiltersStore();
    const createEventMutation = useCreateEvent();
    const isDarkMode = useUserStore(state => state.isDarkMode);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EventFormData>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            title: '',
            location: '',
            category: categories[0]?.name || '',
            start_date: new Date(),
            end_date: new Date(Date.now() + 60 * 60 * 1000),
            ticket_price: 0,
            description: '',
            image: undefined,
            featured: false as boolean,
            max_participants: undefined,
        },
    });

    const onSubmit = async (data: EventFormData) => {
        if (!userId) {
            showError('User not authenticated. Please sign in first.');
            navigate('/auth/sign-in');
            return;
        }

        try {
            const { fetchUserProfile } = await import('@/services');
            await fetchUserProfile();
        } catch (error) {
            console.error('Error ensuring user profile:', error);
            showError('Failed to verify user profile. Please try again.');
            return;
        }

        let image_url = null;
        
        if (data.image && data.image.length > 0) {
            const selectedImage = data.image[0];
            const fileExt = selectedImage.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('events-images')
                .upload(filePath, selectedImage);

            if (uploadError) {
                console.error('Upload failed:', uploadError);
                showError('Failed to upload image');
                image_url = null;
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('events-images')
                    .getPublicUrl(filePath);
                image_url = publicUrl;
            }
        }

        createEventMutation.mutate({
            user_id: userId!,
            title: data.title,
            location: data.location,
            category: data.category,
            start_date: data.start_date,
            end_date: data.end_date,
            ticket_price: data.ticket_price,
            description: data.description,
            image: image_url || undefined, // Convert null to undefined for optional field
            featured: data.featured,
            max_participants: data.max_participants,
        }, {
            onSuccess: () => {
                showSuccess('Event created successfully!');
                reset();
                navigate('/home');
            },
            onError: (error: any) => {
                showError('Error creating event: ' + error.message);
            }
        });
    };

    const onError = (errors: FieldErrors<EventFormData>) => {
        showError('Please fix the errors in the form before submitting.' + JSON.stringify(errors, null, 2));
    };

    return (
        <>
            
            <Container className="relative min-h-screen">
                <Box className='no-scrollbar w-full overflow-y-auto'>
                    <Box className='mb-8 flex w-full items-center justify-between'>
                        <IconButton size='medium' onClick={() => navigate(-1)}>
                            <KeyboardArrowLeft />
                        </IconButton>
                        <Typography variant='h4' className={`font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create Event</Typography>
                        <Box className='w-10' />
                    </Box>
                <Box className='space-y-6'>
                    <form 
                        onSubmit={handleSubmit(onSubmit, onError)}
                        className='space-y-6'
                    >
                <TextField
                    label='Title'
                    fullWidth
                    {...register('title')}
                    error={!!errors.title}
                    helperText={errors.title?.message}
                />
                <Controller
                    name='location'
                    control={control}
                    render={({ field }) => (
                        <LocationPicker
                            value={field.value || ''}
                            onChange={field.onChange}
                            error={!!errors.location}
                            helperText={errors.location?.message}
                        />
                    )}
                />

                <Controller
                    name='start_date'
                    control={control}
                    render={({ field }) => (
                        <DateTimePicker
                            label='Start Date'
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    name='end_date'
                    control={control}
                    render={({ field }) => (
                        <DateTimePicker
                            label='End Date'
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Box className='flex w-full gap-2'>
                    <Controller
                        name='category'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                select
                                label='Category'
                                fullWidth
                                {...field}
                                error={!!errors.category}
                                helperText={errors.category?.message}
                            >
                                {categories.map(category => (
                                    <MenuItem key={category.name} value={category.name}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <TextField
                        label='Ticket Price'
                        fullWidth
                        {...register('ticket_price', {
                            valueAsNumber: true,
                            min: { value: 0, message: 'Ticket price can not be negative' },
                        })}
                        helperText={errors.ticket_price?.message}
                        error={!!errors.ticket_price}
                    />
                </Box>

                <TextField
                    label='Max Participants (Optional)'
                    fullWidth
                    type='number'
                    {...register('max_participants', {
                        valueAsNumber: true,
                        min: { value: 1, message: 'Max participants must be at least 1' },
                    })}
                    helperText={errors.max_participants?.message || 'Leave empty for unlimited participants'}
                    error={!!errors.max_participants}
                />
                <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label='Description'
                            multiline
                            rows={3}
                            className='w-full'
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />
                    )}
                />

                <Controller
                    name='image'
                    control={control}
                    render={({ field }) => (
                        <>
                            <Button
                                component='label'
                                className='flex h-24 flex-col items-center justify-center rounded-3xl border border-dashed border-primary-1 bg-primary-500/10 text-primary-1'
                            >
                                <ImageOutlined />
                                Add Photo +
                                <input
                                    type='file'
                                    hidden
                                    onChange={e => field.onChange(Array.from(e.target.files ?? []))}
                                ></input>
                            </Button>
                            {errors.image?.message && (
                                <Typography variant='caption' color='error'>
                                    {String(errors.image.message)}
                                </Typography>
                            )}
                            {field.value?.[0] && (
                                <Typography variant='body2' color='textSecondary'>
                                    {field.value[0].name}
                                </Typography>
                            )}
                        </>
                    )}
                />

                        <Button 
                            variant='contained' 
                            type='submit'
                            disabled={createEventMutation.isPending}
                            size="large"
                            className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
                        </Button>
                    </form>
                </Box>
                </Box>
            </Container>
        </>
    );
};
export default CreateEvent;

