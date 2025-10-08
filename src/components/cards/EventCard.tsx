import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
    Avatar,
    AvatarGroup,
    IconButton,
    Divider,
} from '@mui/material';
import { CalendarToday, LocationOn, Favorite } from '@mui/icons-material';
import { formatSmartDate, formatPrice } from '@/utils/format';
import type { UnifiedItem } from '@/utils/schemas';
import { useFavorite } from '@/hooks/useFavorite';
import { useUserStore } from '@/store/userStore';
import { showSuccess } from '@/utils/notifications';

type EventCardVariant = 'vertical' | 'horizontal' | 'vertical-compact' | 'horizontal-compact';
type ActionType = 'join' | 'favorite' | 'cancel' | 'full' | 'leave';

interface EventCardProps {
    item: UnifiedItem;
    variant: EventCardVariant;
    actionType?: ActionType;
    onAction?: (e?: React.MouseEvent) => void;
    disabled?: boolean;
    className?: string;
}

export const EventCard = ({
    item,
    variant = 'vertical',
    actionType = 'join',
    onAction,
    disabled = false,
    className = '',
}: EventCardProps) => {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const { isFavorite, toggle, isLoading, isEnabled } = useFavorite(item.id?.toString(), item.type);

    const handleCardClick = () => {
        navigate(`/events/${item.id}`, { state: { event: item } });
    };

    const { type, category } = item;
    const member_avatars = item.member_avatars || [];
    const member_count = item.member_count || 0;
    const title = item.title;
    const imageUrl = item.image || '/illustrations/eventcard.png';
    const location = item.location || 'Online';
    const start_date = item.start_date;
    const price = type === 'event' ? item.ticket_price : 0;
    const memberAvatars = member_avatars ?? [];
    const memberCount = member_count || 0;

    const isCancelled = item.status === 'cancelled';
    const isComplete = actionType === 'cancel' && !isCancelled;
    const isFull = type === 'event' ? item.max_participants && memberCount >= item.max_participants : false;

    const renderContent = () => {
        switch (variant) {
            case 'vertical':
                return (
                    <>
                        <Box className='relative h-32 w-56'>
                            <CardMedia
                                component='img'
                                image={imageUrl}
                                alt={title}
                                className='h-full w-full rounded-xl'
                            />
                            {category && (
                                <Chip 
                                    label={category} 
                                    size='small' 
                                    className='absolute top-2 left-2 z-10 text-xs font-medium h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' 
                                />
                            )}
                        </Box>
                        <CardContent className='flex flex-1 flex-col gap-3 p-0'>
                            <Typography
                                variant='h6'
                                className={`text-base font-semibold mb-2 line-clamp-2 leading-tight ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
                            >
                                {title}
                            </Typography>
                            <Box className='flex sm:flex-row sm:justify-between gap-2'>
                                <Box className='flex items-center gap-2'>
                                    <CalendarToday className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                    <Typography
                                        className={`text-xs font-medium line-clamp-1 ${isDarkMode ? 'text-blue-400' : 'text-gray-600'}`}
                                    >
                                        {formatSmartDate(start_date, false)}
                                    </Typography>
                                </Box>
                                <Box className='flex items-center gap-2'>
                                    <LocationOn className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                    <Typography
                                        className={`text-xs font-medium line-clamp-1 ${isDarkMode ? 'text-blue-400' : 'text-gray-600'}`}
                                    >
                                        {location}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box className='flex items-center justify-between'>
                                <AvatarGroup max={3} total={memberCount} spacing={4} className='text'>
                                    {memberAvatars.map((avatar: string, index: number) => (
                                        <Avatar key={index} src={avatar} alt={`Member ${index + 1}`} />
                                    ))}
                                </AvatarGroup>
                                {actionType !== 'favorite' && actionType !== 'cancel' && actionType !== 'leave' && (
                                    <Button
                                        variant='contained'
                                        size='small'
                                        onClick={e => {
                                            e.stopPropagation();
                                            onAction?.(e);
                                        }}
                                        disabled={disabled}
                                        className={`min-w-20 h-9 text-sm font-medium rounded-full transition-all duration-200 ${
                                            isFull 
                                                ? 'bg-gray-500 text-white' 
                                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5'
                                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isFull ? 'Full' : 'Join'}
                                    </Button>
                                )}
                                {actionType === 'cancel' && (
                                    <Button
                                        variant='contained'
                                        size='small'
                                        onClick={
                                            isCancelled
                                                ? undefined
                                                : e => {
                                                      e.stopPropagation();
                                                      onAction?.(e);
                                                  }
                                        }
                                        disabled={isCancelled}
                                        className={`h-9 text-sm font-medium rounded-full transition-all duration-200-cancel ${
                                            isCancelled
                                                ? 'cursor-not-allowed bg-gray-500'
                                                : isDarkMode
                                                  ? 'bg-red-600 hover:bg-red-700'
                                                  : 'bg-red-500 hover:bg-red-600'
                                        }`}
                                    >
                                        {isCancelled ? 'Cancelled' : 'Cancel'}
                                    </Button>
                                )}
                                {actionType === 'leave' && (
                                    <Button
                                        variant='contained'
                                        size='small'
                                        onClick={e => {
                                            e.stopPropagation();
                                            onAction?.(e);
                                        }}
                                        className='h-9 text-sm font-medium rounded-full transition-all duration-200-leave'
                                    >
                                        Leave
                                    </Button>
                                )}
                            </Box>
                        </CardContent>
                    </>
                );

            case 'vertical-compact':
                return (
                    <>
                        <Box className='relative h-20 w-full'>
                            <CardMedia
                                component='img'
                                image={imageUrl}
                                alt={title}
                                className='h-full w-full rounded-xl object-cover'
                            />
                            {category && (
                                <Chip 
                                    label={category} 
                                    size='small' 
                                    className='absolute top-2 left-2 z-10 text-xs font-medium h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' 
                                />
                            )}
                        </Box>
                        <CardContent className='mt-2 p-0'>
                            <Typography
                                variant='h6'
                                className={`text-sm font-semibold mt-2 line-clamp-2 ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
                            >
                                {title}
                            </Typography>
                            {location && (
                                <Box className='mt-2 flex items-center gap-2'>
                                    <LocationOn className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                    <Typography
                                        className={`text-xs font-medium line-clamp-1 ${isDarkMode ? 'text-blue-400' : 'text-gray-600'}`}
                                    >
                                        {location}
                                    </Typography>
                                </Box>
                            )}
                            <Box className='mt-2 flex items-center justify-between'>
                                <Box className='flex items-center'>
                                    {memberCount > 0 && (
                                        <AvatarGroup
                                            max={3}
                                            total={memberCount}
                                            spacing={4}
                                            className='event-card-avatars-medium'
                                        >
                                            {memberAvatars.map((avatar: string, index: number) => (
                                                <Avatar key={index} src={avatar} alt={`Member ${index + 1}`} />
                                            ))}
                                        </AvatarGroup>
                                    )}
                                </Box>

                                <Box className='flex items-center gap-3'>
                                    {price !== undefined && (
                                        <Typography
                                            className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                                        >
                                            {price && price > 0 ? formatPrice(price) : 'Free'}
                                        </Typography>
                                    )}
                                    {actionType === 'favorite' && (
                                        <Box onClick={e => e.stopPropagation()}>
                                            <IconButton
                                                size='medium'
                                                onClick={e => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (isEnabled) {
                                                        toggle();
                                                        const action = isFavorite ? 'removed from' : 'added to';
                                                        showSuccess(`Item ${action} favorites!`);
                                                    }
                                                }}
                                                disabled={!isEnabled || isLoading}
                                                className={`w-8 h-8 rounded-full transition-all duration-200 ${
                                                    isFavorite
                                                        ? 'border-2 border-red-300 bg-red-100 text-red-600 hover:bg-red-200'
                                                        : 'border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <Favorite
                                                    className={`text-sm ${isFavorite ? 'text-red-600' : 'text-neutral-500'}`}
                                                />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </>
                );

            case 'horizontal-compact':
                return (
                    <Box className='flex h-full gap-2'>
                        <CardMedia component='img' image={imageUrl} className='h-full w-20 rounded-xl' />
                        <Box className='flex w-full flex-col justify-between'>
                            <Typography
                                variant='body2'
                                className={`text-sm font-semibold line-clamp-2 ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
                            >
                                {title}
                            </Typography>
                            <Box className='flex items-center gap-2'>
                                <CalendarToday className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                <Typography className={`text-xs font-medium line-clamp-1 ${isDarkMode ? 'text-blue-400' : 'text-gray-600'}`}>
                                    {formatSmartDate(start_date, true)}
                                </Typography>
                            </Box>
                            <Box className='flex items-center justify-between'>
                                <Typography
                                    variant='body2'
                                    className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                                >
                                    {price ? formatPrice(price) : 'Free'}
                                </Typography>
                                {actionType !== 'favorite' && actionType !== 'cancel' && actionType !== 'leave' && (
                                    <Button
                                        variant='contained'
                                        size='small'
                                        onClick={onAction}
                                        disabled={disabled}
                                        className={`h-9 text-sm font-medium rounded-full transition-all duration-200 ${
                                            isFull 
                                                ? 'bg-gray-500 text-white' 
                                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5'
                                        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isFull ? 'Full' : 'Join'}
                                    </Button>
                                )}
                                {actionType === 'cancel' && (
                                    <Button
                                        variant='contained'
                                        size='small'
                                        onClick={isCancelled ? undefined : onAction}
                                        disabled={isCancelled}
                                        className={`h-9 text-sm font-medium rounded-full transition-all duration-200-cancel ${
                                            isCancelled
                                                ? 'cursor-not-allowed bg-gray-500'
                                                : isDarkMode
                                                  ? 'bg-red-600 hover:bg-red-700'
                                                  : 'bg-red-500 hover:bg-red-600'
                                        }`}
                                    >
                                        {isCancelled ? 'Cancelled' : 'Cancel'}
                                    </Button>
                                )}
                                {actionType === 'leave' && (
                                    <Button
                                        variant='contained'
                                        size='small'
                                        onClick={e => {
                                            e.stopPropagation();
                                            onAction?.(e);
                                        }}
                                        className='h-9 text-sm font-medium rounded-full transition-all duration-200-leave'
                                    >
                                        Leave
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                );

            case 'horizontal':
                return (
                    <Box className='flex flex-col gap-3'>
                        <Box className='flex gap-3'>
                            <CardMedia component='img' image={imageUrl} className='h-24 w-24 rounded-lg' />
                            <Box className='flex h-24 w-full flex-col justify-between gap-1'>
                                <Box className='flex items-start justify-between gap-2'>
                                    <Typography
                                        variant='h6'
                                        className={`text-sm font-semibold line-clamp-2 flex-1 leading-tight ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}
                                    >
                                        {title}
                                    </Typography>
                                    {category && (
                                        <Chip
                                            label={category}
                                            size='small'
                                            className='text-xs font-medium h-5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                                        />
                                    )}
                                </Box>
                                {start_date && (
                                    <Box className='mt-2 flex items-center gap-2'>
                                        <CalendarToday className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                        <Typography
                                            className={`text-xs font-medium line-clamp-1 ${isDarkMode ? 'text-blue-400' : 'text-gray-600'}`}
                                        >
                                            {formatSmartDate(start_date, true)}
                                        </Typography>
                                    </Box>
                                )}

                                <Box className='flex items-center justify-between'>
                                    <Box className='flex items-center gap-3'>
                                        <Typography
                                            variant='body2'
                                            className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}
                                        >
                                            {price ? formatPrice(price) : 'Free'}
                                        </Typography>
                                    </Box>
                                    {actionType !== 'favorite' && actionType !== 'cancel' && actionType !== 'leave' && (
                                        <Button
                                            variant='contained'
                                            size='small'
                                            onClick={e => {
                                                e.stopPropagation();
                                                onAction?.(e);
                                            }}
                                            disabled={disabled}
                                            className={`h-9 text-sm font-medium rounded-full transition-all duration-200 ${
                                                isFull 
                                                    ? 'bg-gray-500 text-white' 
                                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:-translate-y-0.5'
                                            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {isFull ? 'Full' : 'Join'}
                                        </Button>
                                    )}
                                    {actionType === 'favorite' && (
                                        <Box onClick={e => e.stopPropagation()} className='p-1'>
                                            <IconButton
                                                size='large'
                                                onClick={e => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (isEnabled) {
                                                        toggle();
                                                        const action = isFavorite ? 'removed from' : 'added to';
                                                        showSuccess(`Item ${action} favorites!`);
                                                    }
                                                }}
                                                disabled={!isEnabled || isLoading}
                                                className={`w-8 h-8 rounded-full transition-all duration-200 ${
                                                    isFavorite
                                                        ? 'border-2 border-red-300 bg-red-100 text-red-600 hover:bg-red-200'
                                                        : 'border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                <Favorite
                                                    className={`text-sm ${isFavorite ? 'text-red-600' : 'text-neutral-500'}`}
                                                />
                                            </IconButton>
                                        </Box>
                                    )}
                                    {actionType === 'cancel' && (
                                        <Button
                                            variant='contained'
                                            size='small'
                                            onClick={
                                                isCancelled
                                                    ? undefined
                                                    : e => {
                                                          e.stopPropagation();
                                                          onAction?.(e);
                                                      }
                                            }
                                            disabled={isCancelled}
                                            className={`h-9 text-sm font-medium rounded-full transition-all duration-200-cancel ${
                                                isCancelled
                                                    ? 'cursor-not-allowed bg-gray-500'
                                                    : isDarkMode
                                                      ? 'bg-red-600 hover:bg-red-700'
                                                      : 'bg-red-500 hover:bg-red-600'
                                            }`}
                                        >
                                            {isCancelled ? 'Cancelled' : 'Cancel'}
                                        </Button>
                                    )}
                                    {actionType === 'leave' && (
                                        <Button
                                            variant='contained'
                                            size='small'
                                            onClick={e => {
                                                e.stopPropagation();
                                                onAction?.(e);
                                            }}
                                            className='h-9 text-sm font-medium rounded-full transition-all duration-200-leave'
                                        >
                                            Leave
                                        </Button>
                                    )}
                                    {isComplete && (
                                        <Button
                                            variant='contained'
                                            size='small'
                                            onClick={e => e.stopPropagation()}
                                            className={`h-9 text-sm font-medium rounded-full transition-all duration-200-cancel ${
                                                isCancelled
                                                    ? isDarkMode
                                                        ? 'bg-red-600'
                                                        : 'bg-red-500'
                                                    : isDarkMode
                                                      ? 'bg-gray-800'
                                                      : 'bg-gray-700'
                                            }`}
                                        >
                                            {isCancelled ? 'Cancelled' : 'Completed'}
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                        {isComplete && (
                            <>
                                <Divider />
                                <Box className='flex w-full items-center justify-between gap-3'>
                                    <Button
                                        variant='outlined'
                                        size='small'
                                        className='h-9 text-sm font-medium rounded-full transition-all duration-200-outline'
                                        onClick={e => e.stopPropagation()}
                                    >
                                        Leave Review
                                    </Button>
                                    <Button
                                        variant='contained'
                                        size='small'
                                        className='h-9 text-sm font-medium rounded-full transition-all duration-200-outline'
                                        onClick={e => e.stopPropagation()}
                                    >
                                        View Ticket
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Box onClick={handleCardClick} className='cursor-pointer'>
            <Card
                className={`flex flex-col overflow-hidden rounded-2xl p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${variant === 'vertical' && 'max-h-80 min-h-72 w-60 gap-3'} ${variant === 'horizontal-compact' && 'h-24 w-full'} ${variant === 'vertical-compact' && 'h-56 w-40'} ${variant === 'horizontal' ? (isComplete ? 'h-48' : 'h-32') + ' w-full' : ''} ${className} `}
            >
                {renderContent()}
            </Card>
        </Box>
    );
};
export default EventCard;

