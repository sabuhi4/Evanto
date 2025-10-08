import React from 'react';
import {
  Apps,
  MusicNote,
  SportsSoccer,
  Brush,
  Computer,
  Restaurant,
  School,
  Business,
  MoreHoriz
} from '@mui/icons-material';

export const getCategoryIcon = (iconName: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'apps': <Apps fontSize='small' />,
    'music_note': <MusicNote fontSize='small' />,
    'sports_soccer': <SportsSoccer fontSize='small' />,
    'brush': <Brush fontSize='small' />,
    'computer': <Computer fontSize='small' />,
    'restaurant': <Restaurant fontSize='small' />,
    'school': <School fontSize='small' />,
    'business': <Business fontSize='small' />,
    'more_horiz': <MoreHoriz fontSize='small' />,
  };
  
  return iconMap[iconName] || <Apps fontSize='small' />;
};
