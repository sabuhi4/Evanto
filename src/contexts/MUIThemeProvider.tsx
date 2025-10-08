import React, { ReactNode } from 'react';
import { ThemeProvider as MUIThemeProviderCore } from '@mui/material/styles';
import createBaseTheme from '@/styles/muiTheme';
import { useUserStore } from '@/store/userStore';

interface MUIThemeProviderProps {
  children: ReactNode;
}

export const MUIThemeProvider: React.FC<MUIThemeProviderProps> = ({ children }) => {
  const isDarkMode = useUserStore(state => state.isDarkMode);
  const theme = createBaseTheme(isDarkMode);

  return (
    <MUIThemeProviderCore theme={theme}>
      {children}
    </MUIThemeProviderCore>
  );
};
