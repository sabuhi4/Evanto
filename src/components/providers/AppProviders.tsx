import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { queryClient } from '@/lib/queryClient';
import { MUIThemeProvider } from '@/contexts/MUIThemeProvider';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { AppRoutes } from '@/routes';

const RealtimeProvider: React.FC = () => {
    useRealtimeUpdates();
    return null;
};

interface AppProvidersProps {
    children?: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
    return (
        <MUIThemeProvider>
            <QueryClientProvider client={queryClient}>
                <RealtimeProvider />
                <ReactQueryDevtools initialIsOpen={false} />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Router>
                        {children || <AppRoutes />}
                    </Router>
                </LocalizationProvider>
            </QueryClientProvider>
            <Toaster 
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerStyle={{
                    top: 20,
                }}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </MUIThemeProvider>
    );
};
