import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { showError } from '@/utils/notifications';
import { supabase } from '@/utils/supabase';
import { Container } from '@mui/material';
import { useUserStore } from '@/store/userStore';
import LogoLight from '@/assets/icons/logo-light.svg?react';
import LogoDark from '@/assets/icons/logo-dark.svg?react';
import { Apple, Google, Facebook } from '@mui/icons-material';

function Welcome() {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);

    const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin + '/',
                scopes: provider === 'google' ? 'openid email profile https://www.googleapis.com/auth/userinfo.profile' : undefined,
                queryParams: provider === 'google' ? {
                    access_type: 'offline',
                    prompt: 'consent',
                    include_granted_scopes: 'true',
                } : undefined,
            },
        });

        if (error) {
            showError('OAuth sign-in failed: ' + error.message);
        }
    };

    return (
        <>
            
            <Container className="relative min-h-screen flex items-center justify-center">
                <Box className={'flex flex-col gap-6 items-center text-center w-full max-w-sm'}>
                    <Box className="flex justify-center">
                        {isDarkMode ? (
                            <LogoDark className="w-24 h-24 my-4" />
                        ) : (
                            <LogoLight className="w-24 h-24 my-4" />
                        )}
                    </Box>
                    
                    <Box className='flex flex-col gap-5 w-full'>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/auth/sign-in')}
                            className="font-jakarta h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            Sign In
                        </Button>
                        
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/auth/sign-up')}
                            className={`font-jakarta h-12 text-base font-medium rounded-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                                isDarkMode 
                                    ? 'border-white text-white hover:bg-white hover:bg-opacity-10' 
                                    : 'border-blue-500 text-blue-500 hover:bg-blue-50'
                            }`}
                        >
                            Sign Up
                        </Button>
                    </Box>
                    
                    <Box className='flex items-center'>
                        <Box className={`flex-1 h-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                        <Typography variant="caption" className={`px-4 font-jakarta ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Or continue with
                        </Typography>
                        <Box className={`flex-1 h-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
                    </Box>
                    
                    <Box className='flex flex-row items-center justify-center gap-8 w-full'>
                        <Button
                            variant="contained"
                            className={`w-12 h-12 rounded-full p-0 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                                isDarkMode 
                                    ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <Apple className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                        </Button>
                        
                        <Button
                            variant="contained"
                            onClick={() => handleOAuthSignIn('google')}
                            className={`w-12 h-12 rounded-full p-0 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                                isDarkMode 
                                    ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <Google className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                        </Button>
                        
                        <Button
                            variant="contained"
                            className={`w-12 h-12 rounded-full p-0 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                                isDarkMode 
                                    ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            <Facebook className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}

export default Welcome;
