import { Box, Typography, Button, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Container } from '@mui/material';
import { TextField } from '@mui/material';
import { KeyboardArrowLeft, MailOutline as MailOutlineIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { forgotPasswordSchema } from '@/utils/schemas';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/utils/supabase';
import { showSuccess, showError } from '@/utils/notifications';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        showSuccess('Sending verification code...');

        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: `${window.location.origin}/auth/verify-code`,
        });

        if (error) {
            showError(error.message);
            return;
        }

        showSuccess('Verification code sent!');

        localStorage.setItem('reset_email', data.email);
        navigate('/auth/email-sent');

        reset();
    };
    return (
        <Container className='relative'>
            <Box className='no-scrollbar w-full overflow-y-auto'>
                <Box className='mb-8 flex w-full items-center justify-between'>
                    <IconButton size='medium' onClick={() => navigate(-1)} className="" sx={{ borderRadius: '50%' }}>
                        <KeyboardArrowLeft />
                    </IconButton>
                    <Typography variant='h5' className="text-gray-900 dark:text-white">Forgot Password</Typography>
                    <Box className='w-10' />
                </Box>
                <Box className='flex flex-col gap-6 text-start'>
                    <Typography variant='body1'>
                        Enter the email associated with your account and we'll send an email with instructions to reset your
                        password.
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
                        <TextField
                            label='Email'
                            placeholder='example@gmail.com'
                            type='email'
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <MailOutlineIcon color='disabled' />
                                    </InputAdornment>
                                ),
                            }}
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            className='text-input'
                        />
                        <Button 
                            variant='contained' 
                            type='submit' 
                            disabled={isSubmitting}
                            fullWidth
                            className='h-12 font-jakarta text-base font-medium mt-4'
                            style={{ 
                                width: '100%',
                                minWidth: '100%',
                                maxWidth: '100%'
                            }}
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : 'Send'}
                        </Button>
                    </form>
                </Box>
            </Box>
        </Container>
    );
}

export default ForgotPassword;
