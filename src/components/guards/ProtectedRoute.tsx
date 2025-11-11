import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user } = useUserStore();

    console.log('ProtectedRoute check:', { hasUser: !!user, userEmail: user?.email });

    if (!user) {
        console.log('No user - redirecting to sign-in');
        return <Navigate to="/auth/sign-in" replace />;
    }

    return <>{children}</>;
};
