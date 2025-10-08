import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography, IconButton, ToggleButton, Divider, Box, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {
    KeyboardArrowLeft,
    Add,
    ListOutlined,
    GridViewOutlined,
    Edit,
    Delete,
} from '@mui/icons-material';
import { Container } from '@mui/material';
import EventCard from '@/components/cards/EventCard';
import { useUnifiedItems } from '@/hooks/useUnifiedItems';
import { usePagination } from '@/hooks/usePagination';
import type { UnifiedItem } from '@/utils/schemas';
import { useUserStore } from '@/store/userStore';
import { useDeleteEvent } from '@/hooks/useData';
import { useDeleteMeetup } from '@/hooks/useData';
import { showSuccess, showError } from '@/utils/notifications';
import { ContainerDialog } from '@/components/dialogs/ContainerDialog';

function ManageEvents() {
    const [cardVariant, setCardVariant] = useState<'horizontal' | 'vertical-compact'>('horizontal');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<UnifiedItem | null>(null);
    const { getVisibleItems, loadMore, hasMore, getRemainingCount } = usePagination();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    
    const navigate = useNavigate();
    const user = useUserStore(state => state.user);
    const deleteEventMutation = useDeleteEvent();
    const deleteMeetupMutation = useDeleteMeetup();
    
    // Use unified data fetching
    const { data: items = [] } = useUnifiedItems();
    
    // Filter to show only user's events
    const userEvents = useMemo(() => {
        if (!user?.id) return [];
        return items.filter(item => item.user_id === user.id);
    }, [items, user?.id]);
    
    const loading = !items.length;

    const handleCreateEvent = () => {
        navigate('/events/create');
    };

    const handleCreateMeetup = () => {
        navigate('/meetups/create/step-1');
    };

    const handleEditEvent = async (item: UnifiedItem) => {
        try {
            // Navigate to edit page with item data and type
            navigate(`/events/${item.id}/edit`, { state: { item, itemType: item.type } });
        } catch (error) {
            showError('Failed to edit item');
        }
    };



    const handleDeleteClick = (item: UnifiedItem) => {
        setItemToDelete(item);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'event') {
            deleteEventMutation.mutate(itemToDelete.id as string, {
                onSuccess: () => {
                    showSuccess('Event deleted successfully');
                    setDeleteDialogOpen(false);
                    setItemToDelete(null);
                },
                onError: (error) => {
                    console.error('Delete error:', error);
                    showError('Failed to delete event');
                }
            });
        } else if (itemToDelete.type === 'meetup') {
            deleteMeetupMutation.mutate(itemToDelete.id as string, {
                onSuccess: () => {
                    showSuccess('Meetup deleted successfully');
                    setDeleteDialogOpen(false);
                    setItemToDelete(null);
                },
                onError: (error) => {
                    console.error('Delete error:', error);
                    showError('Failed to delete meetup');
                }
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };



    if (!user) {
        return (
            <>
                <Container className="relative min-h-screen">
                    <Typography variant="h6" className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Please sign in to manage your events
                    </Typography>
                </Container>
            </>
        );
    }

    return (
        <>
            <Container className="relative min-h-screen">
            <Box className="no-scrollbar w-full overflow-y-auto">
                {/* Header */}
                <Box className="mb-8 flex flex-col w-full items-center ">
                    <Box className="flex items-center  mb-8 w-full mx-auto">
                        <IconButton 
                            onClick={() => navigate(-1)} 
                            className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} border border-neutral-200 bg-gray-100 dark:bg-gray-700 rounded-full`}
                        >
                            <KeyboardArrowLeft />
                        </IconButton>
                        <Typography variant="h5" className="text-blue-500 dark:text-blue-400 mx-auto">Manage Events</Typography>
                    </Box>
                    <Box className="flex gap-3 w-full">
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleCreateEvent}
                            className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                            size="small"
                            sx={{ 
                                textTransform: 'none',
                                fontSize: '1rem',
                                padding: '2px 8px',
                                height: '50px'
                            }}
                        >
                            Event
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleCreateMeetup}
                            className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                            size="small"
                            sx={{ 
                                textTransform: 'none',
                                fontSize: '1rem',
                                padding: '2px 8px',
                                height: '50px'
                            }}
                        >
                            Meetup
                        </Button>
                    </Box>
                </Box>

                {/* Stats */}
                <Box className={`grid h-20 w-full grid-cols-[1fr_auto_1fr_auto_1fr] items-center rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                    <Box className="text-center">
                        <Typography variant="h4" className="text-blue-500 dark:text-blue-400">
                            {userEvents.length}
                        </Typography>
                        <Typography variant="body2" className="${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}">
                            Events
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem className="h-10 self-center" />
                    <Box className="text-center">
                        <Typography variant="h4" className="text-blue-500 dark:text-blue-400">
                            {userEvents.filter(e => e.featured).length}
                        </Typography>
                        <Typography variant="body2" className="${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}">
                            Featured
                        </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem className="h-10 self-center" />
                    <Box className="text-center">
                        <Typography variant="h4" className="text-blue-500 dark:text-blue-400">
                            {userEvents.filter(e => e.type === 'meetup' && e.status === 'active').length}
                        </Typography>
                        <Typography variant="body2" className="${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}">
                            Online
                        </Typography>
                    </Box>
                </Box>

                {/* View Toggle */}
                <Box className="mb-4 flex w-full items-center justify-between">
                    <Typography variant="body2" className="text-blue-500 dark:text-blue-400">
                        {userEvents.length} events found
                    </Typography>
                    <Stack direction="row">
                        <IconButton
                            size="small"
                            onClick={() => setCardVariant('horizontal')}
                            className={cardVariant === 'horizontal' ? 'text-blue-500 dark:text-blue-400' : `${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
                        >
                            <ListOutlined />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => setCardVariant('vertical-compact')}
                            className={cardVariant === 'vertical-compact' ? 'text-blue-500 dark:text-blue-400' : `${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
                        >
                            <GridViewOutlined />
                        </IconButton>
                    </Stack>
                </Box>

                {/* Events Grid/List */}
                {loading ? (
                    <Box className="flex justify-center py-8">
                        <Typography variant="body2" className="${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}">
                            Loading your events...
                        </Typography>
                    </Box>
                ) : userEvents.length > 0 ? (
                    <Box
                        className={`no-scrollbar mb-4 w-full gap-4 overflow-y-auto flex-1 ${
                            cardVariant === 'vertical-compact' ? 'grid grid-cols-2' : 'flex flex-col'
                        }`}
                    >
                        {getVisibleItems(userEvents).map(item => {
                            // Determine action type based on status
                            const isCancelled = item.status === 'cancelled';
                            const actionType = isCancelled ? 'cancel' : 'favorite';
                            
                            return (
                                <Box key={item.id} className="relative">
                                    <EventCard
                                        item={item}
                                        variant={cardVariant}
                                        actionType={actionType}
                                        onAction={() => {}}
                                    />
                                <Box className="absolute top-2 left-2 flex gap-2">
                                    <IconButton
                                        size="small"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            handleEditEvent(item);
                                        }}
                                        sx={{ 
                                            width: 32, 
                                            height: 32,
                                            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                                            color: isDarkMode ? '#f3f4f6' : '#374151',
                                            '&:hover': {
                                                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 1)',
                                            },
                                        }}
                                    >
                                        <Edit sx={{ fontSize: 16 }} />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            handleDeleteClick(item);
                                        }}
                                        sx={{ 
                                            width: 32, 
                                            height: 32,
                                            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                                            color: isDarkMode ? '#f3f4f6' : '#374151',
                                            '&:hover': {
                                                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 1)',
                                            },
                                        }}
                                    >
                                        <Delete sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Box>
                            </Box>
                            );
                        })}

                        {hasMore(userEvents.length) && (
                            <Box className='mt-4 flex justify-center'>
                                <Button
                                    variant='outlined'
                                    onClick={loadMore}
                                    className='text-primary-1 border-primary-1'
                                >
                                    Load More ({getRemainingCount(userEvents.length)} remaining)
                                </Button>
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box className={`rounded-2xl p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-neutral-50'}`}>
                        <Typography variant="h6" className="mb-2 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}">
                            No events yet
                        </Typography>
                        <Typography variant="body2" className="mb-4 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}">
                            Start creating your first event to get started
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleCreateEvent}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                            sx={{ textTransform: 'none' }}
                        >
                            Create Your First Event
                        </Button>
                    </Box>
                )}

                {/* Delete Confirmation Dialog */}
                <ContainerDialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteCancel}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle className='font-jakarta font-semibold text-blue-500 dark:text-blue-400'>
                        Confirm Deletion
                    </DialogTitle>
                    <DialogContent>
                        <Typography className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleDeleteCancel}
                            variant="outlined"
                            className="font-jakarta"
                            sx={{
                                borderColor: isDarkMode ? '#374151' : '#d1d5db',
                                color: isDarkMode ? '#9ca3af' : '#6b7280',
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            variant="contained"
                            className="font-jakarta"
                            sx={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#dc2626',
                                },
                            }}
                        >
                            Delete
                    </Button>
                </DialogActions>
            </ContainerDialog>
            </Box>
            </Container>
        </>
    );
}

export default ManageEvents;

