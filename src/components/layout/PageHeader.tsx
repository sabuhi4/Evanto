import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { KeyboardArrowLeft, MoreVertOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

interface PageHeaderProps {
    title: string;
    showBackButton?: boolean;
    showMenuButton?: boolean;
    onBackClick?: () => void;
    onMenuClick?: () => void;
    rightIcon?: React.ReactNode;
    onRightIconClick?: () => void;
    className?: string;
}

export const PageHeader = ({
    title,
    showBackButton = true,
    showMenuButton = true,
    onBackClick,
    onMenuClick,
    rightIcon,
    onRightIconClick,
    className = 'mb-6'
}: PageHeaderProps): React.JSX.Element => {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);

    const handleBackClick = () => {
        if (onBackClick) {
            onBackClick();
        } else {
            navigate(-1);
        }
    };

    // If custom right icon is provided, use it; otherwise use default menu button
    const rightButton = rightIcon ? (
        <IconButton 
            size='medium'
            onClick={onRightIconClick}
        >
            {rightIcon}
        </IconButton>
    ) : (
        <IconButton 
            size='medium'
            onClick={onMenuClick}
            className={`${showMenuButton ? 'visible' : 'invisible'}`}
        >
            <MoreVertOutlined />
        </IconButton>
    );

    return (
        <Box className={`flex w-full items-center justify-between ${className}`}>
            <IconButton 
                size='medium'
                onClick={handleBackClick} 
                className={`${showBackButton ? 'visible' : 'invisible'}`}
            >
                <KeyboardArrowLeft />
            </IconButton>
            
            <Typography variant='h5' className={`font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {title}
            </Typography>
            
            {rightButton}
        </Box>
    );
}
