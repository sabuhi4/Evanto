import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/utils/schemas';

type Location = {
    lat: number;
    lng: number;
};

interface UserState {
    user: User | null;
    location: Location | null;
    city: string | null;
    country: string | null;
    error: string | null;
    isDarkMode: boolean;
    
    setUser: (user: User | null) => void;
    setLocation: (location: Location) => void;
    setError: (error: string | null) => void;
    setCity: (city: string | null) => void;
    setCountry: (country: string | null) => void;
    setCoordinates: (coords: { lat: number; lng: number }) => void;
    setIsDarkMode: (isDark: boolean) => void;
    toggleDarkMode: () => void;
}

const getSystemPreference = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            location: null,
            city: null,
            country: null,
            error: null,
            isDarkMode: getSystemPreference(),
            
            setUser: user => set({ user }),
            setLocation: location => set({ location }),
            setError: error => set({ error }),
            setCity: city => set({ city }),
            setCountry: country => set({ country }),
            setCoordinates: coords => set({ location: coords }),
            setIsDarkMode: isDark => {
                set({ isDarkMode: isDark });
                if (typeof window !== 'undefined') {
                    document.documentElement.classList.toggle('dark', isDark);
                }
            },
            toggleDarkMode: () => {
                const newMode = !get().isDarkMode;
                set({ isDarkMode: newMode });
                if (typeof window !== 'undefined') {
                    document.documentElement.classList.toggle('dark', newMode);
                }
            },
        }),
        {
            name: 'user-store',
            partialize: (state) => ({ 
                isDarkMode: state.isDarkMode,
                user: state.user,
                city: state.city,
                country: state.country,
            }),
        }
    )
);
