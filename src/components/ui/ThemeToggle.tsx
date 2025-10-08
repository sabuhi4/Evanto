import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useUserStore } from '@/store/userStore';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const ThemeToggle = ({ 
  size = 'medium', 
  className = '' 
}: ThemeToggleProps): React.JSX.Element => {
  const isDarkMode = useUserStore(state => state.isDarkMode);
  const toggleDarkMode = useUserStore(state => state.toggleDarkMode);

  return (
    <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={toggleDarkMode}
        size={size}
        className={`${isDarkMode 
          ? 'bg-blue-500/20 border-blue-400 text-blue-300 hover:bg-blue-500/30' 
          : 'bg-white/90 border-blue-500 text-blue-600 hover:bg-white shadow-lg hover:shadow-xl'
        } border backdrop-blur-sm transition-all duration-200 ${className}`}
      >
        {isDarkMode ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
};


