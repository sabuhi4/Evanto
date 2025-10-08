import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showSuccess, showError } from '@/utils/notifications';
import { z } from 'zod';
import { supabase } from '@/utils/supabase';
import { signUpSchema } from '@/utils/schemas';
import { Box, Divider, Typography, Button, IconButton, Container, TextField, InputAdornment } from '@mui/material';
import { 
    FacebookOutlined, 
    Apple as AppleIcon, 
    Google as GoogleIcon, 
    Visibility, 
    VisibilityOff,
    MailOutline as MailOutlineIcon,
    LockOutlined as LockOutlinedIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import LogoLight from '@/assets/icons/logo-light.svg?react';
import LogoDark from '@/assets/icons/logo-dark.svg?react';
import { useUserStore } from '@/store/userStore';

export const SignUp = () => {
    const navigate = useNavigate();
    const { setUser } = useUserStore();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
    });

    const handleGoogleSignIn = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`
                }
            });

            if (error) {
                showError('Google sign-in failed. Please try again.');
            }
        } catch (error) {
            showError('Google sign-in failed. Please try again.');
        }
    };

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        full_name: data.fullName,
                    }
                }
            });

            if (authError) {
                if (authError.message.includes('already registered') || 
                    authError.message.includes('already exists') ||
                    authError.message.includes('User already registered')) {
                    showError('An account with this email already exists. Please sign in instead.');
                } else if (authError.message.includes('email')) {
                    showError('Email error: Please use a valid email address or check your Supabase email settings');
                } else {
                    showError(`Signup failed: ${authError.message}`);
                }
                return;
            }

            if (authData.user) {
                const userData = {
                    id: authData.user.id,
                    email: authData.user.email || '',
                    full_name: data.fullName,
                    avatar_url: authData.user.user_metadata?.avatar_url,
                    user_interests: [],
                    notifications_enabled: true,
                    language: 'en',
                    dark_mode: false,
                };
                setUser(userData);

                showSuccess('Account created successfully!');
                navigate('/home');
            }
        } catch (error) {
            showError('An unexpected error occurred during signup');
        }
    };

    return (
        <>
            <Container className="relative min-h-screen">
                <Box className="flex flex-col gap-6 text-start">
                <Box className="flex justify-center">
                    {isDarkMode ? (
                        <LogoDark className="my-4" />
                    ) : (
                        <LogoLight className="my-4" />
                    )}
                </Box>
                <Typography variant="h3" className={`font-jakarta font-semibold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Create your account
                </Typography>
                <Typography variant="body2" className={`font-jakarta leading-relaxed ${isDarkMode ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    Evanto virtual event organizing application that is described as a news mobile app.
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <TextField
                        label="Full Name"
                        placeholder="Enter your full name"
                        type="text"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonIcon color="disabled" />
                                </InputAdornment>
                            ),
                        }}
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                        {...register('fullName')}
                    />
                    <TextField
                        label="Email"
                        placeholder="example@gmail.com"
                        type="email"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <MailOutlineIcon color="disabled" />
                                </InputAdornment>
                            ),
                        }}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...register('email')}
                    />
                    <TextField
                        label="Password"
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon color="disabled" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...register('password')}
                    />
                    <TextField
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon color="disabled" />
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
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        className="font-jakarta h-12 text-base font-medium"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <Box className="flex w-full flex-col items-center gap-6">
                    <Divider className={`before:bg-gray-200 after:bg-gray-200 [&_.MuiDivider-wrapper]:text-sm ${isDarkMode ? 'before:bg-gray-600 after:bg-gray-600 [&_.MuiDivider-wrapper]:text-gray-300' : '[&_.MuiDivider-wrapper]:text-neutral-500'}`}>
                        Or continue with
                    </Divider>
                    <Box className="flex w-full justify-center gap-3">
                        <Button variant="outlined" className="h-12 w-12 font-jakarta min-w-12">
                            <AppleIcon className="text-blue-500 text-xl" />
                        </Button>
                        <Button 
                            variant="outlined" 
                            className="h-12 w-12 font-jakarta min-w-12"
                            onClick={handleGoogleSignIn}
                        >
                            <GoogleIcon className="text-blue-500 text-xl" />
                        </Button>
                        <Button variant="outlined" className="h-12 w-12 font-jakarta min-w-12">
                            <FacebookOutlined className="text-blue-500 text-xl" />
                        </Button>
                    </Box>
                    <Box className="w-full text-center mt-2">
                        <Typography variant="body2" className={`font-jakarta ${isDarkMode ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            Already have an account? <Link to="/auth/sign-in" className="text-blue-500 font-medium">Sign In</Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
            </Container>
        </>
    );
};
