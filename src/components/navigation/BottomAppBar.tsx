import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';

interface BottomAppBarProps {
    className?: string;
}

export const BottomAppBar = ({ className }: BottomAppBarProps): React.JSX.Element => {
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = useState(0);

    React.useEffect(() => {
        const path = location.pathname;
        if (path === '/' || path === '/home' || path === '/main-page-1') {
            setValue(0);
        } else if (path === '/favorites') {
            setValue(1);
        } else if (path === '/search') {
            setValue(2);
        } else if (path === '/tickets') {
            setValue(3);
        } else if (path === '/profile') {
            setValue(4);
        }
    }, [location.pathname]);

    const handleNavigation = (newValue: number, route: string) => {
        setValue(newValue);
        navigate(route);
    };

    const curvedSvg = `
      <svg width="375" height="119" viewBox="0 0 375 119" fill="transparent" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 45.4588C0 35.6318 7.6144 27.4855 17.419 26.823L126.986 19.4199C138.815 18.6206 149.268 27.3095 150.869 39.0577C152.801 53.2385 162.778 65.237 176.433 69.5247C183.637 71.7871 191.423 71.7681 198.628 69.5057C212.222 65.2369 222.35 53.6031 224.583 39.5306L224.683 38.9008C226.561 27.0672 237.16 18.6231 249.114 19.4363L357.373 26.8009C367.296 27.4759 375 35.7218 375 45.6675V108H0V45.4588Z" fill="${isDarkMode ? 'rgb(28 32 57)' : 'white'}"/>
      </svg>
    `;

    return (
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          showLabels
          className={`${className} absolute bottom-0 -left-6 -right-6 w-[calc(100%+48px)] h-[119px] pt-6`}
          sx={{ 
            background: `url("data:image/svg+xml,${encodeURIComponent(curvedSvg)}")`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            '& .MuiBottomNavigationAction-label': {
              display: 'block',
              fontSize: '12px',
              marginTop: '4px',
              color: isDarkMode ? '#CBD5E1' : '#4B5563'
            }
          }}
        >
          <BottomNavigationAction 
            label="Home" 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            onClick={() => handleNavigation(0, '/home')}
            className="-mr-5"
          />
          <BottomNavigationAction 
            label="Favorites" 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            onClick={() => handleNavigation(1, '/favorites')}
            className="-ml-5"
          />
          <Box
            className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30 z-10 flex items-center justify-center cursor-pointer"
            onClick={() => handleNavigation(2, '/search')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L19 12L12 22L5 12L12 2Z" fill="white"/>
            </svg>
          </Box>
          <BottomNavigationAction 
            label="Tickets" 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M2 9C2 7.89543 2.89543 7 4 7H20C21.1046 7 22 7.89543 22 9V10C20.8954 10 20 10.8954 20 12C20 13.1046 20.8954 14 22 14V15C22 16.1046 21.1046 17 20 17H4C2.89543 17 2 16.1046 2 15V14C3.10457 14 4 13.1046 4 12C4 10.8954 3.10457 10 2 10V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            onClick={() => handleNavigation(3, '/tickets')}
            className="-mr-5"
          />
          <BottomNavigationAction 
            label="Profile" 
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            onClick={() => handleNavigation(4, '/profile')}
            className="-ml-5"
          />
        </BottomNavigation>
    );
};

