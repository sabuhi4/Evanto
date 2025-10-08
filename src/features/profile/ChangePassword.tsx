import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { showSuccess, showError } from '@/utils/notifications';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Typography, Button, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { supabase } from '@/utils/supabase';
import { Container } from '@mui/material';
import { TextField } from '@mui/material';
import { PageHeader } from '@/components/layout/PageHeader';
import { BottomAppBar } from '@/components/navigation/BottomAppBar';

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
        confirmPassword: z.string(),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

function ChangePassword() {
    const navigate = useNavigate();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
    });

    const handleBack = () => {
        navigate(-1);
    };

    const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
        const { currentPassword, newPassword } = data;

        // First verify current password by attempting to sign in
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: (await supabase.auth.getUser()).data.user?.email || '',
            password: currentPassword,
        });

        if (authError) {
            showError('Current password is incorrect');
            return;
        }

        // If current password is correct, update to new password
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            showError(error.message);
            return;
        }

        showSuccess('Password updated successfully!');
        setTimeout(() => navigate(-1), 1500);
    };

    return (
        <>
            <Container className='relative min-h-screen'>
                <PageHeader 
                    title="Change Password"
                    showBackButton={true}
                    showMenuButton={false}
                    onBackClick={handleBack}
                    className="mb-8"
                />

                <Box className='flex flex-col gap-6'>
                    <Box className='text-center'>
                        <Typography variant='h5' className='font-semibold mb-2'>
                            Change Your Password
                        </Typography>
                        <Typography variant='body2' className='text-neutral-500'>
                            Enter your current password and choose a new one.
                        </Typography>
                    </Box>

                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                        <TextField
                            label='Current Password'
                            placeholder='Enter current password'
                            type={showCurrentPassword ? 'text' : 'password'}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <LockOutlined color='disabled' />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            edge="end"
                                        >
                                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword?.message}
                            {...register('currentPassword')}
                            className='text-input'
                        />

                        <TextField
                            label='New Password'
                            placeholder='Enter new password'
                            type={showNewPassword ? 'text' : 'password'}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <LockOutlined color='disabled' />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            edge="end"
                                        >
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword?.message}
                            {...register('newPassword')}
                            className='text-input'
                        />

                        <TextField
                            label='Confirm New Password'
                            placeholder='Confirm new password'
                            type={showConfirmPassword ? 'text' : 'password'}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <LockOutlined color='disabled' />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                            className='text-input'
                        />

                        <Button
                            type='submit'
                            variant='contained'
                            fullWidth
                            disabled={isSubmitting}
                            className='h-12 bg-primary hover:bg-primary-dark text-white font-semibold'
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} color='inherit' />
                            ) : (
                                'Change Password'
                            )}
                        </Button>
                    </form>
                </Box>

                <BottomAppBar />
            </Container>
        </>
    );
}

export default ChangePassword;
