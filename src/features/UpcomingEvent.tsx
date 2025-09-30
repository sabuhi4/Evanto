import { Chip, IconButton, Stack, Typography } from '@mui/material';
import { Container } from '@mui/material';
import { BottomAppBar } from '@/components/navigation/BottomAppBar';
import { useFiltersStore } from '@/store/filtersStore';
import { getCategoryIcon } from '@/components/icons/CategoryIcon';
import { KeyboardArrowLeft, MoreVertOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import EventCard from '@/components/cards/EventCard';
import { useUnifiedItems } from '@/hooks/useUnifiedItems';
import { usePagination } from '@/hooks/usePagination';
import { Box, Button } from '@mui/material';
import { isAfter, isToday, startOfDay } from 'date-fns';
import { useDarkMode } from '@/contexts/DarkModeContext';

function UpcomingEvent() {
    const navigate = useNavigate();
    const { categoryFilter, setCategoryFilter, categories } = useFiltersStore();
    const { getVisibleItems, loadMore, hasMore, getRemainingCount } = usePagination();
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const { data: allItems = [] } = useUnifiedItems();

    const today = startOfDay(new Date());
    const upcomingItems = allItems.filter(item => {
        const eventDate = new Date(item.start_date);

        return isAfter(eventDate, today) || isToday(eventDate);
    });

    const filteredItems =
        categoryFilter === 'All' ? upcomingItems : upcomingItems.filter(item => item.category === categoryFilter);

    return (
        <>
            <Box className='absolute right-4 top-4 z-10 flex gap-2'>
                <Button
                    onClick={toggleDarkMode}
                    size='small'
                    variant='outlined'
                    className={`text-xs ${isDarkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-700'}`}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </Button>
            </Box>

            <Container className='relative min-h-screen'>
                <Box className='no-scrollbar w-full overflow-y-auto'>
                    <Box className='mb-8 flex w-full items-center justify-between'>
                        <IconButton
                            onClick={() => navigate(-1)}
                            className={`text-text-3 border border-neutral-200 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            <KeyboardArrowLeft />
                        </IconButton>
                        <Typography
                            variant='h4'
                            className={`font-jakarta font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        >
                            Upcoming Events
                        </Typography>
                        <IconButton
                            className={`text-text-3 border border-neutral-200 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            <MoreVertOutlined />
                        </IconButton>
                    </Box>
                    <Stack direction='row' spacing={1} className='no-scrollbar mb-4 overflow-x-auto'>
                        {categories.map(({ name, iconName }) => (
                            <Chip
                                key={name}
                                label={name}
                                icon={<span className='text-xs'>{getCategoryIcon(iconName)}</span>}
                                clickable
                                color={categoryFilter === name ? 'primary' : 'default'}
                                onClick={() => setCategoryFilter(categoryFilter === name ? 'All' : name)}
                                className={`cursor-pointer ${
                                    categoryFilter === name
                                        ? 'bg-primary text-white'
                                        : isDarkMode
                                          ? 'border border-white/20 bg-white/20 text-white'
                                          : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                sx={{
                                    '&.MuiChip-root': {
                                        backgroundColor:
                                            categoryFilter === name
                                                ? '#5D9BFC'
                                                : isDarkMode
                                                  ? 'rgba(255, 255, 255, 0.2)'
                                                  : '#F3F4F6',
                                        color: categoryFilter === name ? 'white' : isDarkMode ? 'white' : '#374151',
                                        borderColor:
                                            categoryFilter === name
                                                ? '#5D9BFC'
                                                : isDarkMode
                                                  ? 'rgba(255, 255, 255, 0.2)'
                                                  : '#D1D5DB',
                                        '&:hover': {
                                            backgroundColor:
                                                categoryFilter === name
                                                    ? '#4A8BFC'
                                                    : isDarkMode
                                                      ? 'rgba(255, 255, 255, 0.3)'
                                                      : '#E5E7EB',
                                        },
                                        '& .MuiChip-icon': {
                                            color: categoryFilter === name ? 'white' : isDarkMode ? 'white' : '#000000',
                                        },
                                    },
                                }}
                            />
                        ))}
                    </Stack>
                    <Typography
                        variant='h4'
                        className={`self-start font-jakarta font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                        Event List
                    </Typography>
                    <Stack direction='column' spacing={2} className='py-4 pb-20'>
                        {filteredItems.length > 0 ? (
                            getVisibleItems(filteredItems).map(item => {
                                // Determine action type based on status
                                const isCancelled = item.status === 'cancelled';
                                const actionType = isCancelled ? 'cancel' : 'favorite';

                                return (
                                    <EventCard key={item.id} item={item} variant='horizontal' actionType={actionType} />
                                );
                            })
                        ) : (
                            <Typography
                                variant='body2'
                                className={`py-4 text-center font-jakarta ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                            >
                                {categoryFilter === 'All'
                                    ? 'No upcoming events found.'
                                    : `No upcoming ${categoryFilter.toLowerCase()} events found.`}
                            </Typography>
                        )}

                        {hasMore(filteredItems.length) && (
                            <Box className='mt-4 flex justify-center'>
                                <Button
                                    variant='outlined'
                                    onClick={loadMore}
                                    className={`${isDarkMode ? 'border-blue-400 text-blue-400 hover:bg-blue-400/10' : 'text-primary-1 border-primary-1'}`}
                                    sx={{
                                        borderColor: isDarkMode ? '#5D9BFC' : '#5D9BFC',
                                        color: isDarkMode ? '#5D9BFC' : '#5D9BFC',
                                        '&:hover': {
                                            borderColor: isDarkMode ? '#4A8BFC' : '#4A8BFC',
                                            backgroundColor: isDarkMode
                                                ? 'rgba(93, 155, 252, 0.1)'
                                                : 'rgba(93, 155, 252, 0.04)',
                                        },
                                    }}
                                >
                                    Load More ({getRemainingCount(filteredItems.length)})
                                </Button>
                            </Box>
                        )}
                    </Stack>
                </Box>
                <BottomAppBar />
            </Container>
        </>
    );
}

export default UpcomingEvent;
