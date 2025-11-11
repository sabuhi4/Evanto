import { useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { useUserStore } from '@/store/userStore';

export const useSupabaseAuthSync = () => {
    const setUser = useUserStore(state => state.setUser);

    useEffect(() => {
        // Check for existing session on mount with timeout
        const initializeSession = async () => {
            try {
                // Add timeout to prevent hanging
                const sessionPromise = supabase.auth.getSession();
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Session check timeout')), 5000)
                );

                const { data: { session }, error } = await Promise.race([
                    sessionPromise,
                    timeoutPromise
                ]).catch(() => {
                    return { data: { session: null }, error: null };
                });

                if (error) {
                    return;
                }

                if (session?.user) {
                    const { data: userProfile } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (userProfile) {
                        setUser(userProfile);
                    }
                }
            } catch {
            }
        };

        initializeSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const { data: userProfile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (userProfile) {
                    setUser(userProfile);
                } else {
                    const newUser = {
                        id: session.user.id,
                        email: session.user.email || '',
                        full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                        avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
                        user_interests: [],
                        notifications_enabled: true,
                        language: 'en',
                        dark_mode: false,
                    };

                    const { error } = await supabase
                        .from('users')
                        .insert(newUser);

                    if (!error) {
                        setUser(newUser);
                    }
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [setUser]);
};