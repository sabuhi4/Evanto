import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

interface PublicRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
    children, 
    redirectTo = "/home" 
}) => {
    const { user } = useUserStore();
    
    if (user) {
        return <Navigate to={redirectTo} replace />;
    }
    
    return <>{children}</>;
};

