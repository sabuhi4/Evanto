import React, { useState } from 'react';
import { AddCircleOutlineRounded, KeyboardArrowLeftOutlined, CreditCard, Delete, Edit } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, Typography, CircularProgress, Chip, Divider, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Container } from '@mui/material';
import { usePaymentCards } from '@/hooks/usePaymentCards';
import { useDeletePaymentCard, useSetDefaultPaymentCard } from '@/hooks/usePaymentCards';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '@/utils/notifications';
import { ContainerDialog } from '@/components/dialogs/ContainerDialog';
import { useUserStore } from '@/store/userStore';

function CreateCard() {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const { data: paymentCards, isLoading, refetch } = usePaymentCards();
    const { mutate: deleteCard } = useDeletePaymentCard();
    const { mutate: setDefaultCard } = useSetDefaultPaymentCard();
    
    // Confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<{ id: string; lastFourDigits: string } | null>(null);

    const handleDeleteClick = (cardId: string, lastFourDigits: string) => {
        setCardToDelete({ id: cardId, lastFourDigits });
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!cardToDelete) return;
        
        deleteCard(cardToDelete.id, {
            onSuccess: () => {
                showSuccess('Card deleted successfully');
                setDeleteDialogOpen(false);
                setCardToDelete(null);
                refetch();
            },
            onError: () => {
                showError('Failed to delete card');
            },
        });
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCardToDelete(null);
    };

    const handleSetDefault = (cardId: string) => {
        setDefaultCard(cardId, {
            onSuccess: () => {
                showSuccess('Default payment card updated');
                refetch();
            },
            onError: () => {
                showError('Failed to set default card');
            },
        });
    };

    const getCardTypeIcon = (cardType: string) => {
        switch (cardType.toLowerCase()) {
            case 'mastercard':
                return <CreditCard />;
            case 'visa':
                return <CreditCard />;
            default:
                return <CreditCard />;
        }
    };

    if (isLoading) {
        return (
            <>
                <Container className="relative min-h-screen">
                    <Box className={'mb-8 flex w-full items-center justify-between'}>
                        <IconButton size='medium' onClick={() => navigate(-1)} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} border border-neutral-200 bg-gray-100 dark:bg-gray-700`}>
                            <KeyboardArrowLeftOutlined />
                        </IconButton>
                        <Typography variant='h4' className="font-jakarta font-semibold text-blue-500 dark:text-blue-400">
                            Payment Cards
                        </Typography>
                        <Box className="w-10 h-10" />
                    </Box>
                    <Box className="flex justify-center items-center h-96">
                        <CircularProgress />
                    </Box>
                </Container>
            </>
        );
    }

    return (
        <>
            
            <Container className="relative min-h-screen">
                {/* Header */}
                <Box className={'mb-8 flex w-full items-center justify-between'}>
                    <IconButton size='medium' onClick={() => navigate(-1)} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} border border-neutral-200 bg-gray-100 dark:bg-gray-700`} sx={{ borderRadius: '50%' }}>
                        <KeyboardArrowLeftOutlined />
                    </IconButton>
                    <Typography variant='h4' className={`font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Payment Cards
                    </Typography>
                    <Box className="w-10 h-10" />
                </Box>

                {/* All Cards Section */}
                <Box className="w-full self-start mb-4">
                    <Typography variant='h4' className={`mb-3 font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        All Cards
                    </Typography>

                    {paymentCards && paymentCards.length > 0 ? (
                        <Box className="w-full">
                            {paymentCards.map((card, index) => (
                                <Box
                                    key={card.id}
                                    className={`flex cursor-pointer items-center justify-between rounded-lg p-4 mb-3 w-full border transition-all hover:shadow-md hover:-translate-y-0.5 ${
                                        card.is_default 
                                            ? 'border-2 border-primary bg-primary/5' 
                                            : 'border border-gray-200 dark:border-gray-600'
                                    } ${
                                        isDarkMode 
                                            ? 'bg-gray-800 hover:bg-gray-700' 
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <Box className="flex items-center gap-1.5">
                                        {getCardTypeIcon(card.card_type)}
                                        <Box>
                                            <Box className="flex items-center gap-2">
                                                <Typography variant='body2' className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    **** {card.last_four_digits}
                                                </Typography>
                                                {card.is_default && (
                                                    <Chip 
                                                        label="Default" 
                                                        size="small" 
                                                        className="bg-blue-500 text-white text-xs"
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant='caption' className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                                {card.card_type.toUpperCase()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box className="flex items-center gap-1">
                                        {!card.is_default && (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSetDefault(card.id);
                                                }}
                                                className="text-xs px-2 py-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                                            >
                                                Set Default
                                            </Button>
                                        )}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/payments/details?edit=${card.id}`);
                                            }}
                                            className="text-blue-500 hover:bg-blue-50"
                                        >
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(card.id, card.last_four_digits);
                                            }}
                                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Box>
                            </Box>
                        ))}
                    </Box>
                    ) : (
                        <Box className={`text-center py-8 w-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <CreditCard className="text-5xl mb-2 opacity-50 mx-auto" />
                            <Typography variant="body2" className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                No cards added yet
                            </Typography>
                        </Box>
                    )}
            </Box>

                {/* Recently Used Card Section */}
                <Box className="w-full self-start mb-4">
                    <Typography variant='h4' className={`mb-3 font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Recently Used Card
                    </Typography>

                    {paymentCards && paymentCards.length > 0 ? (
                        <Box className="w-full">
                            <Box
                                className="h-48 w-full rounded-2xl relative overflow-hidden shadow-lg"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                }}
                            >
                                {/* Card Content */}
                                <Box className="relative z-30 flex h-full flex-col justify-between p-6 gap-2 text-white">
                                    <Box className="flex items-start justify-between">
                                        <Typography variant='body2' className="text-sm font-medium">
                                            Credit
                                        </Typography>
                                        <Box className="h-8 w-8">
                                            {getCardTypeIcon(paymentCards[0].card_type)}
                                        </Box>
                                    </Box>

                                    <Box className="flex items-end justify-between">
                                        <Box className="flex flex-col gap-0.5">
                                            <Typography className="font-medium text-base">
                                                {paymentCards[0].card_type.toUpperCase()}
                                            </Typography>
                                            <Typography className="font-mono tracking-wider text-base">
                                                **** **** **** {paymentCards[0].last_four_digits}
                                            </Typography>
                                        </Box>

                                        <Box className="text-right">
                                            <Typography variant='caption' className="opacity-80">
                                                Valid date
                                            </Typography>
                                            <Typography className="font-medium text-base">
                                                {paymentCards[0].expiry_date}
                                            </Typography>
                                        </Box>
                                    </Box>
                            </Box>
                        </Box>
                    </Box>
                    ) : (
                        <Box className={`text-center py-8 w-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <CreditCard className="text-5xl mb-2 opacity-50 mx-auto" />
                            <Typography variant="body2" className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                No recently used card
                            </Typography>
                        </Box>
                    )}
            </Box>

                {/* Add New Card Button */}
                <Box className="w-full mt-auto mb-4">
                    <Button
                        variant='outlined'
                        fullWidth
                        className="h-14 gap-2 border-2 border-dashed border-blue-500 text-blue-500 font-medium text-base hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => navigate('/payments/details')}
                    >
                        <AddCircleOutlineRounded className="h-6 w-6" />
                        Add New Card
                    </Button>
                </Box>

                {/* Delete Confirmation Dialog */}
                <ContainerDialog
                    open={deleteDialogOpen}
                    onClose={handleDeleteCancel}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle className={`font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Confirm Deletion
                    </DialogTitle>
                    <DialogContent>
                        <Typography className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Are you sure you want to delete the card ending in {cardToDelete?.lastFourDigits}? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleDeleteCancel}
                            variant="outlined"
                            className="font-poppins"
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
                            className="font-poppins"
                            sx={{
                                backgroundColor: '#dc2626',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#b91c1c',
                                },
                            }}
                        >
                            Delete
                    </Button>
                </DialogActions>
            </ContainerDialog>
            </Container>
        </>
    );
}

export default CreateCard;

