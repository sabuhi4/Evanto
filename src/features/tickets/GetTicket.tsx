import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Divider,
    TableFooter,
    Button,
    IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/bookingStore';
import { UnifiedItem } from '@/utils/schemas';
import { useUserStore } from '@/store/userStore';
import { Dialog } from '@mui/material';

interface GetTicketProps {
    open: boolean;
    onClose: () => void;
    item?: UnifiedItem;
}

function GetTicket({ open, onClose }: GetTicketProps) {
    const navigate = useNavigate();
    const { bookingData: bookingFlow, getTotalPrice } = useBookingStore();
    const isDarkMode = useUserStore(state => state.isDarkMode);

    const handleGetTicket = () => {
        onClose();
        navigate('/bookings/summary');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            disableEnforceFocus
            PaperProps={{
                className: "max-h-[75vh] min-h-[200px] h-auto flex flex-col overflow-hidden rounded-2xl"
            }}
        >
            <Box className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/20 flex-shrink-0">
                <Typography 
                    variant="h6" 
                    component="h2" 
                    className={`font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-text-1'}`}
                >
                    Your Selection
                </Typography>
                <IconButton 
                    onClick={onClose}
                    size="small"
                    className={`${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    <Close fontSize="small" />
                </IconButton>
            </Box>
            
            <Box className="overflow-auto p-4 no-scrollbar">

                <Table size='small' className="w-full">
                    <TableHead>
                        <TableRow>
                            <TableCell className={`border-none py-2 px-4 text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Type</TableCell>
                            <TableCell className={`border-none py-2 px-4 text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Column</TableCell>
                            <TableCell className={`border-none py-2 px-4 text-sm font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Seat</TableCell>
                            <TableCell className={`border-none py-2 px-4 text-sm font-semibold uppercase tracking-wide text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Price</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {bookingFlow.selected_seats.map((seat, index) => {
                            const isVip = seat.type.toLowerCase() === 'vip';
                            const originalPrice = isVip ? seat.price / 1.2 : seat.price;
                            
                            return (
                                <TableRow key={index}>
                                    <TableCell className={`border-none py-2 px-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{seat.type}</TableCell>
                                    <TableCell className={`border-none py-2 px-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{`Row ${String.fromCharCode(65 + seat.row)}`}</TableCell>
                                    <TableCell className={`border-none py-2 px-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{`${String.fromCharCode(65 + seat.row)}${seat.column + 1}`}</TableCell>
                                    <TableCell className="border-none py-2 px-4 text-right">
                                        <Box className="flex flex-col items-end">
                                            <Typography 
                                                variant="body2" 
                                                className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                            >
                                                ${seat.price.toFixed(2)}
                                            </Typography>
                                            {isVip && (
                                                <Typography 
                                                    variant="caption" 
                                                    className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                                                >
                                                    (Base: ${originalPrice.toFixed(2)} + 20%)
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        <TableRow>
                            <TableCell colSpan={4} className="p-0">
                                <Divider className={`my-1 ${isDarkMode ? 'border-white/20' : 'border-gray-200'}`} />
                            </TableCell>
                        </TableRow>
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3} className={`border-none py-2 px-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                <Typography variant='body2' className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {bookingFlow.selected_seats.length} Seat
                                    {bookingFlow.selected_seats.length !== 1 ? 's' : ''}
                                </Typography>
                            </TableCell>
                            <TableCell className="border-none py-2 px-4 text-right">
                                <Typography 
                                    variant='body2'
                                    className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                >
                                    ${getTotalPrice().toFixed(2)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>

            </Box>
            
            <Box className="p-4 border-t border-gray-200 dark:border-white/20 flex-shrink-0">
                <Button 
                    variant='contained' 
                    fullWidth 
                    onClick={handleGetTicket} 
                    size='large'
                    className='w-full h-12 bg-primary hover:bg-primary/90 text-white'
                >
                    Get Ticket
                </Button>
            </Box>
        </Dialog>
    );
}

export default GetTicket;

