import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/notifications';
import { supabase } from '@/utils/supabase';
import { Box, Link, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { Container } from '@mui/material';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export const VerifyCode = () => {
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
    const navigate = useNavigate();
    const email = localStorage.getItem('reset_email')?.replace(/(.{2})(.*)(@.*)/, '$1***$3') || 'ex***@gmail.com';

    // Handle cooldown timer
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleVerify = async () => {
        if (otp.length !== OTP_LENGTH) return;

        setIsSubmitting(true);
        const { error } = await supabase.auth.verifyOtp({
            email: localStorage.getItem('reset_email') || '',
            token: otp,
            type: 'email',
        });

        setIsSubmitting(false);
        if (error) {
            showError(error.message);
        } else {
            navigate('/auth/reset-password');
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;

        const email = localStorage.getItem('reset_email');
        if (!email) return;

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: false },
        });

        if (error) {
            showError(error.message);
        } else {
            showSuccess('New verification code sent!');
            setCooldown(RESEND_COOLDOWN);
        }
    };

    return (
        <Container className="relative">
            <Box className="w-full overflow-y-auto">
                <Box className="mb-8 flex w-full items-center justify-between">
                    <IconButton 
                        size="medium" 
                        onClick={() => navigate(-1)} 
                        className="text-neutral-600 border border-neutral-200 bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                        <KeyboardArrowLeft />
                    </IconButton>
                    <Typography variant="h5" className="font-bold text-neutral-900 dark:text-white">Verify Code</Typography>
                    <Box className="w-10" />
                </Box>
                
                <Box className="flex flex-col gap-6 text-start">
                    <Typography variant="body1" className="mb-8 text-center">
                        Please enter the verification code we sent to your email <span className="text-blue-500 font-medium">{email}</span>
                    </Typography>

                    <Box className="flex flex-col space-y-6">
                        <MuiOtpInput
                            value={otp}
                            onChange={setOtp}
                            length={OTP_LENGTH}
                            TextFieldsProps={{
                                className: "w-full h-14",
                                inputProps: {
                                    style: {
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        color: 'rgb(93 155 252)',
                                    }
                                },
                                sx: {
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                        '&:focus-within': { 
                                            backgroundColor: 'rgba(93, 155, 252, 0.1)',
                                            borderColor: 'rgb(93 155 252)'
                                        },
                                    },
                                },
                            }}
                            autoFocus
                        />

                        <Typography variant="body2" className="text-center">
                            Didn't receive it?{' '}
                            <Link
                                onClick={handleResend}
                                className={`text-blue-500 cursor-pointer ${cooldown > 0 ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                            </Link>
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={handleVerify}
                            disabled={isSubmitting || otp.length !== OTP_LENGTH}
                            size="large"
                            className="w-full h-12"
                        >
                            {isSubmitting ? <CircularProgress size={24} /> : 'Verify'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};