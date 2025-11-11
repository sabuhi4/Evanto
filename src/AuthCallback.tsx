import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabase';
import { useUserStore } from '@/store/userStore';
import { showError } from '@/utils/notifications';
import { Box, Typography, CircularProgress } from '@mui/material';

export default function AuthCallback() {
    const navigate = useNavigate();
    const { setUser } = useUserStore();
    const [status, setStatus] = useState('Processing authentication...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                setStatus('Checking authentication...');

                // Get the session from the URL hash/query params with timeout
                const sessionPromise = supabase.auth.getSession();
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Session check timeout')), 5000)
                );

                const { data: { session }, error: sessionError } = await Promise.race([
                    sessionPromise,
                    timeoutPromise
                ]).catch((err) => {
                    throw err;
                });


                if (sessionError) {
                    showError('Authentication failed: ' + sessionError.message);
                    navigate('/auth/sign-in');
                    return;
                }

                if (!session?.user) {
                    showError('No active session found. Please sign in again.');
                    navigate('/auth/sign-in');
                    return;
                }

                setStatus('Loading your profile...');

                // Check if user exists in database
                const { data: userProfile, error: profileError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') {
                }

                if (userProfile) {
                    console.log('Setting existing user and navigating to home');
                    setUser(userProfile);
                    setTimeout(() => {
                        console.log('Navigating to /home with user:', userProfile.email);
                        navigate('/home', { replace: true });
                    }, 100);
                } else {
                    setStatus('Creating your profile...');

                    const newUser = {
                        id: session.user.id,
                        email: session.user.email || '',
                        full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
                        avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
                        user_interests: [],
                        notifications_enabled: true,
                        language: 'en',
                        dark_mode: false,
                    };

                    const { error: insertError } = await supabase
                        .from('users')
                        .insert(newUser);

                    if (insertError) {
                        showError('Failed to create user profile');
                    } else {
                        console.log('Setting new user and navigating to home');
                        setUser(newUser);
                    }

                    setTimeout(() => {
                        console.log('Navigating to /home with new user:', newUser.email);
                        navigate('/home', { replace: true });
                    }, 100);
                }
            } catch (error) {
                showError('Authentication failed. Please try again.');
                navigate('/auth/sign-in');
            }
        };

        handleCallback();
    }, [navigate, setUser]);

    return (
        <Box className="flex flex-col items-center justify-center min-h-screen gap-4">
            <CircularProgress size={48} />
            <Typography variant="body1" className="text-gray-600">
                {status}
            </Typography>
        </Box>
    );
}
