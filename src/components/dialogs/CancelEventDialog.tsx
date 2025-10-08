import React from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { useUserStore } from '@/store/userStore';
import { ContainerDialog } from './ContainerDialog';

interface CancelEventDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    eventTitle: string;
    eventType: 'event' | 'meetup';
    loading?: boolean;
}

const CancelEventDialog: React.FC<CancelEventDialogProps> = ({
    open,
    onClose,
    onConfirm,
    eventTitle,
    eventType,
    loading = false,
}) => {
    const isDarkMode = useUserStore(state => state.isDarkMode);

    return (
        <ContainerDialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle className="text-center pb-2">
                <Box className="flex flex-col items-center gap-3">
                    <Box className={`p-3 rounded-full ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                        <Warning className={`text-2xl ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                    </Box>
                    <Typography 
                        variant="h5" 
                        className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                        Cancel {eventType === 'event' ? 'Event' : 'Meetup'}
                    </Typography>
                </Box>
            </DialogTitle>
            
            <DialogContent className="text-center py-4">
                <Typography 
                    variant="body1" 
                    className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                >
                    Are you sure you want to cancel this {eventType}?
                </Typography>
                <Typography 
                    variant="body2" 
                    className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                    "{eventTitle}"
                </Typography>
                <Typography 
                    variant="body2" 
                    className={`mt-2 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
                >
                    This action cannot be undone. All participants will be notified.
                </Typography>
            </DialogContent>
            
            <DialogActions className="p-6 pt-2 gap-3">
                <Button
                    onClick={onClose}
                    variant="outlined"
                    className={`flex-1 py-2 rounded-xl font-medium ${
                        isDarkMode 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                    disabled={loading}
                >
                    Keep {eventType === 'event' ? 'Event' : 'Meetup'}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    className="flex-1 py-2 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white"
                    disabled={loading}
                >
                    {loading ? 'Canceling...' : `Cancel ${eventType === 'event' ? 'Event' : 'Meetup'}`}
                </Button>
            </DialogActions>
        </ContainerDialog>
    );
};

export default CancelEventDialog;

