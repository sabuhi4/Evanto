import React from 'react';
import { Box, Button, Chip, Typography, TextField, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { KeyboardArrowLeft } from '@mui/icons-material';
import { Container } from '@mui/material';
import { ArrowCircleLeft } from '@mui/icons-material';
import { ConfirmationNumber, CreditCard, LocationOn } from '@mui/icons-material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/store/bookingStore';
import { formatSmartDate } from '@/utils/format';
import { showSuccess, showError } from '@/utils/notifications';
import { useUserStore } from '@/store/userStore';
import { usePaymentCards } from '@/hooks/usePaymentCards';
import { useUnifiedItems } from '@/hooks/useUnifiedItems';
import { useBookings, useCreateBooking } from '@/hooks/useData';

function Summary() {
    const navigate = useNavigate();
    const { bookingData: bookingFlow, setBookingData, getTotalPrice } = useBookingStore();
    const { user } = useUserStore();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const { data: paymentCards, isLoading: cardsLoading, error: cardsError } = usePaymentCards();
    
    // Use unified data fetching
    const { data: items = [] } = useUnifiedItems();
    const { data: userBookings = [] } = useBookings();
    const createBookingMutation = useCreateBooking();

    const item = items.find(i => i.id === bookingFlow.event_id);

    // Data is now fetched via TanStack Query hooks above

    // Auto-select default payment method when component loads
    React.useEffect(() => {
        if (cardsError) {
        }
        
        if (paymentCards && !bookingFlow.payment_method) {
            const defaultCard = paymentCards.find(card => card.is_default);
            if (defaultCard) {
                setBookingData({ payment_method: `card_${defaultCard.id}` });
            }
        }
    }, [paymentCards, bookingFlow.payment_method, setBookingData, cardsError]);

    const handlePayment = async () => {
        try {
            if (!user) {
                showError('Please sign in to complete booking');
                navigate('/auth/sign-in');
                return;
            }

            // Check if user has already booked this event using cached data
            const eventId = item?.type === 'event' ? item?.id : undefined;
            const meetupId = item?.type === 'meetup' ? item?.id : undefined;
            
            const existingBooking = userBookings.find(booking =>
                (eventId && booking.event_id === eventId)
            );

            if (existingBooking) {
                showError('You have already booked this event! View your bookings in the Profile section.');
                return;
            }

            const bookingId = `BK${Date.now()}`.slice(-8);

            // Generate more unique order number with user ID and timestamp
            const orderNumber = `ORD-${user.id!.slice(-8)}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

            // Only store references, not duplicate data
            const bookingPayload = {
                user_id: user.id!,
                event_id: eventId || undefined,
                order_number: orderNumber,
                total_amount: getTotalPrice(),
                status: 'confirmed' as const,
                payment_status: 'paid' as const,
                payment_method_id: bookingFlow.payment_method?.replace('card_', '') || undefined,
                selected_seats: bookingFlow.selected_seats || [],
            };
            
            // Use TanStack Query mutation instead of direct service call
            createBookingMutation.mutate(bookingPayload, {
                onSuccess: () => {
                    setBookingData({ booking_id: bookingId });
                    showSuccess('Booking confirmed!');
                    navigate('/home');
                },
                onError: (bookingError: any) => {
                    // Handle duplicate booking scenario
                    if (bookingError?.code === '23505' && bookingError?.message?.includes('bookings_user_id_event_id_key')) {
                        showError('You have already booked this event!');
                    } else {
                        showError('Failed to create booking. Please try again.');
                    }
                }
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            showError('Payment failed: ' + errorMessage);
        }
    };

    const handleCopyBookingId = async () => {
        if (bookingFlow.booking_id) {
            try {
                await navigator.clipboard.writeText(bookingFlow.booking_id);
                showSuccess('Booking ID copied!');
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to copy';
                showError('Copy failed: ' + errorMessage);
            }
        }
    };

    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return 'Date not set';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    // Helper functions to safely access item properties
    const getItemTitle = () => {
        if (!item) return bookingFlow.event_name || 'Event Name';
        if (item.type === 'event') return item.title;
        if (item.type === 'meetup') return item.title;
        return bookingFlow.event_name || 'Event Name';
    };

    const getItemImage = () => {
        if (!item) return '/illustrations/chairs.png';
        if (item.type === 'event') return item.image || '/illustrations/chairs.png';
        if (item.type === 'meetup') return item.image || '/illustrations/eventcard.png';
        return '/illustrations/chairs.png';
    };

    const getItemLocation = () => {
        if (!item) return bookingFlow.event_location || 'Event Location';
        if (item.type === 'event') return item.location;
        if (item.type === 'meetup') return 'Online';
        return bookingFlow.event_location || 'Event Location';
    };

    const getItemDate = () => {
        if (!item) return bookingFlow.event_date;
        if (item.type === 'event') return item.start_date;
        if (item.type === 'meetup') return item.start_date;
        return bookingFlow.event_date;
    };

    const getItemCategory = () => {
        if (!item) return 'Event';
        return item.category || 'Event';
    };

    // Calculate event time if not set
    const eventTime =
        bookingFlow.event_time ||
        (getItemDate()
            ? new Date(getItemDate()!).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
              })
            : 'Time not set');

    return (
        <>
            <Container className="relative min-h-screen">
                <Box className='mb-8 flex w-full items-center justify-between'>
                    <IconButton 
                        onClick={() => navigate(-1)} 
                        className={`${isDarkMode ? 'text-white border border-white/20 bg-transparent' : 'text-gray-600 border border-neutral-200 bg-gray-100'}`}
                        sx={{
                            border: isDarkMode ? '1px solid #FFFFFF33' : '1px solid #D1D5DB',
                            '&:hover': {
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                            }
                        }}
                    >
                        <KeyboardArrowLeft />
                    </IconButton>
                    <Typography variant='h4' className='font-jakarta font-semibold text-blue-500 dark:text-blue-400'>Summary</Typography>
                    <Box className='w-8' /> {/* Spacer for alignment */}
                </Box>

            <Box className='relative mb-4 h-[449px] w-[335px] mx-auto'>
                <svg 
                    width="335" 
                    height="449" 
                    viewBox="0 0 335 449" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full"
                >
                    <path 
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        d="M0 40C0 21.1438 0 11.7157 5.85786 5.85786C9.44862 2.26711 14.3809 0.877414 22.0038 0.339576C22.091 4.19481 23.6605 7.87369 26.3934 10.6066C29.2064 13.4196 33.0218 15 37 15C40.9782 15 44.7936 13.4196 47.6066 10.6066C50.4196 7.79356 52 3.97825 52 1.90735e-06L40 0H75L60 2.62268e-06C60 3.97825 61.5804 7.79356 64.3934 10.6066C67.2064 13.4196 71.0218 15 75 15C78.9782 15 82.7936 13.4196 85.6066 10.6066C88.4196 7.79356 90 3.97825 90 1.90735e-06L75 0H113L98 2.62268e-06C98 3.97825 99.5804 7.79356 102.393 10.6066C105.206 13.4196 109.022 15 113 15C116.978 15 120.794 13.4196 123.607 10.6066C126.42 7.79356 128 3.97825 128 1.90735e-06L113 0H151L136 2.62268e-06C136 3.97825 137.58 7.79356 140.393 10.6066C143.206 13.4196 147.022 15 151 15C154.978 15 158.794 13.4196 161.607 10.6066C164.42 7.79356 166 3.97825 166 1.90735e-06L151 0H189L174 2.62268e-06C174 3.97825 175.58 7.79356 178.393 10.6066C181.206 13.4196 185.022 15 189 15C192.978 15 196.794 13.4196 199.607 10.6066C202.42 7.79356 204 3.97825 204 1.90735e-06L189 0H227L212 2.62268e-06C212 3.97825 213.58 7.79356 216.393 10.6066C219.206 13.4196 223.022 15 227 15C230.978 15 234.794 13.4196 237.607 10.6066C240.42 7.79356 242 3.97825 242 1.90735e-06L227 0H265L250 2.62268e-06C250 3.97825 251.58 7.79356 254.393 10.6066C257.206 13.4196 261.022 15 265 15C268.978 15 272.794 13.4196 275.607 10.6066C278.42 7.79356 280 3.97825 280 1.90735e-06L265 0H295L288 2.62268e-06C288 3.97825 289.58 7.79356 292.393 10.6066C295.206 13.4196 299.022 15 303 15C306.978 15 310.794 13.4196 313.607 10.6066C316.211 8.00227 317.759 4.53887 317.974 0.882438C322.878 1.65845 326.401 3.11689 329.142 5.85786C335 11.7157 335 21.1438 335 40V126C331.022 126 327.206 127.58 324.393 130.393C321.58 133.206 320 137.022 320 141C320 144.978 321.58 148.794 324.393 151.607C327.206 154.42 331.022 156 335 156V331C331.022 331 327.206 332.58 324.393 335.393C321.58 338.206 320 342.022 320 346C320 349.978 321.58 353.794 324.393 356.607C327.206 359.42 331.022 361 335 361V409C335 427.856 335 437.284 329.142 443.142C324.821 447.463 318.557 448.597 308 448.894C307.972 444.954 306.395 441.182 303.607 438.393C300.794 435.58 296.978 434 293 434C289.022 434 285.206 435.58 282.393 438.393C279.58 441.206 278 445.022 278 449H270C270 445.022 268.42 441.206 265.607 438.393C262.794 435.58 258.978 434 255 434C251.022 434 247.206 435.58 244.393 438.393C241.58 441.206 240 445.022 240 449H232C232 445.022 230.42 441.206 227.607 438.393C224.794 435.58 220.978 434 217 434C213.022 434 209.206 435.58 206.393 438.393C203.58 441.206 202 445.022 202 449H194C194 445.022 192.42 441.206 189.607 438.393C186.794 435.58 182.978 434 179 434C175.022 434 171.206 435.58 168.393 438.393C165.58 441.206 164 445.022 164 449H156C156 445.022 154.42 441.206 151.607 438.393C148.794 435.58 144.978 434 141 434C137.022 434 133.206 435.58 130.393 438.393C127.58 441.206 126 445.022 126 449H118C118 445.022 116.42 441.206 113.607 438.393C110.794 435.58 106.978 434 103 434C99.0218 434 95.2064 435.58 92.3934 438.393C89.5804 441.206 88 445.022 88 449H80C80 445.022 78.4196 441.206 75.6066 438.393C72.7936 435.58 68.9782 434 65 434C61.0218 434 57.2064 435.58 54.3934 438.393C51.5804 441.206 50 445.022 50 449H42C42 445.022 40.4196 441.206 37.6066 438.393C34.7936 435.58 30.9782 434 27 434C23.0218 434 19.2064 435.58 16.3934 438.393C14.0674 440.719 12.5842 443.731 12.1403 446.953C9.63326 446.094 7.58956 444.874 5.85786 443.142C0 437.284 0 427.856 0 409V361C3.97825 361 7.79355 359.42 10.6066 356.607C13.4196 353.794 15 349.978 15 346C15 342.022 13.4196 338.206 10.6066 335.393C7.79356 332.58 3.97825 331 2.50336e-06 331L0 346V156C3.97825 156 7.79356 154.42 10.6066 151.607C13.4196 148.794 15 144.978 15 141C15 137.022 13.4197 133.206 10.6066 130.393C7.79356 127.58 3.97825 126 3.45703e-06 126L0 141V40ZM25.5 138H29.0491C29.3253 138 29.5491 138.224 29.5491 138.5C29.5491 138.776 29.3253 139 29.0491 139H25.5C25.2239 139 25 138.776 25 138.5C25 138.224 25.2239 138 25.5 138ZM52.3719 138H59.4702C59.7463 138 59.9702 138.224 59.9702 138.5C59.9702 138.776 59.7463 139 59.4702 139H52.3719C52.0958 139 51.8719 138.776 51.8719 138.5C51.8719 138.224 52.0958 138 52.3719 138ZM97.5035 138.5C97.5035 138.224 97.7274 138 98.0035 138H105.102C105.378 138 105.602 138.224 105.602 138.5C105.602 138.776 105.378 139 105.102 139H98.0035C97.7274 139 97.5035 138.776 97.5035 138.5ZM127.925 138.5C127.925 138.224 128.148 138 128.425 138H135.523C135.799 138 136.023 138.224 136.023 138.5C136.023 138.776 135.799 139 135.523 139H128.425C128.148 139 127.925 138.776 127.925 138.5ZM165.944 138C166.22 138 166.444 138.224 166.444 138.5C166.444 138.776 166.22 139 165.944 139H158.846C158.569 139 158.346 138.776 158.346 138.5C158.346 138.224 158.569 138 158.846 138H165.944ZM203.977 138.5C203.977 138.224 204.201 138 204.477 138H211.575C211.852 138 212.075 138.224 212.075 138.5C212.075 138.776 211.852 139 211.575 139H204.477C204.201 139 203.977 138.776 203.977 138.5ZM241.996 138C242.273 138 242.496 138.224 242.496 138.5C242.496 138.776 242.273 139 241.996 139H234.898C234.622 139 234.398 138.776 234.398 138.5C234.398 138.224 234.622 138 234.898 138H241.996ZM249.609 138.5C249.609 138.224 249.833 138 250.109 138H257.207C257.483 138 257.707 138.224 257.707 138.5C257.707 138.776 257.483 139 257.207 139H250.109C249.833 139 249.609 138.776 249.609 138.5ZM280.03 138.5C280.03 138.224 280.254 138 280.53 138H287.628C287.904 138 288.128 138.224 288.128 138.5C288.128 138.776 287.904 139 287.628 139H280.53C280.254 139 280.03 138.776 280.03 138.5ZM295.74 138H302.839C303.115 138 303.339 138.224 303.339 138.5C303.339 138.776 303.115 139 302.839 139H295.74C295.464 139 295.24 138.776 295.24 138.5C295.24 138.224 295.464 138 295.74 138ZM310.451 138.5C310.451 138.224 310.675 138 310.951 138H314.5C314.776 138 315 138.224 315 138.5C315 138.776 314.776 139 314.5 139H310.951C310.675 139 310.451 138.776 310.451 138.5ZM25.5 343C25.2239 343 25 343.224 25 343.5C25 343.776 25.2239 344 25.5 344H29.0491C29.3253 344 29.5491 343.776 29.5491 343.5C29.5491 343.224 29.3253 343 29.0491 343H25.5ZM219.188 138.5C219.188 138.224 219.412 138 219.688 138H226.786C227.062 138 227.286 138.224 227.286 138.5C227.286 138.776 227.062 139 226.786 139H219.688C219.412 139 219.188 138.776 219.188 138.5ZM181.154 138C181.431 138 181.654 138.224 181.654 138.5C181.654 138.776 181.431 139 181.154 139H174.056C173.78 139 173.556 138.776 173.556 138.5C173.556 138.224 173.78 138 174.056 138H181.154ZM143.135 138.5C143.135 138.224 143.359 138 143.635 138H150.733C151.009 138 151.233 138.224 151.233 138.5C151.233 138.776 151.009 139 150.733 139H143.635C143.359 139 143.135 138.776 143.135 138.5ZM120.312 138C120.588 138 120.812 138.224 120.812 138.5C120.812 138.776 120.588 139 120.312 139H113.214C112.938 139 112.714 138.776 112.714 138.5C112.714 138.224 112.938 138 113.214 138H120.312ZM67.0825 138.5C67.0825 138.224 67.3063 138 67.5825 138H74.6807C74.9568 138 75.1807 138.224 75.1807 138.5C75.1807 138.776 74.9568 139 74.6807 139H67.5825C67.3063 139 67.0825 138.776 67.0825 138.5ZM36.6614 138.5C36.6614 138.224 36.8853 138 37.1614 138H44.2597C44.5358 138 44.7597 138.224 44.7597 138.5C44.7597 138.776 44.5358 139 44.2597 139H37.1614C36.8853 139 36.6614 138.776 36.6614 138.5ZM82.293 138.5C82.293 138.224 82.5168 138 82.793 138H89.8912C90.1674 138 90.3912 138.224 90.3912 138.5C90.3912 138.776 90.1674 139 89.8912 139H82.793C82.5168 139 82.293 138.776 82.293 138.5ZM188.767 138.5C188.767 138.224 188.991 138 189.267 138H196.365C196.641 138 196.865 138.224 196.865 138.5C196.865 138.776 196.641 139 196.365 139H189.267C188.991 139 188.767 138.776 188.767 138.5ZM265.319 138H272.418C272.694 138 272.918 138.224 272.918 138.5C272.918 138.776 272.694 139 272.418 139H265.319C265.043 139 264.819 138.776 264.819 138.5C264.819 138.224 265.043 138 265.319 138ZM37.1614 343C36.8853 343 36.6614 343.224 36.6614 343.5C36.6614 343.776 36.8853 344 37.1614 344H44.2597C44.5358 344 44.7597 343.776 44.7597 343.5C44.7597 343.224 44.5358 343 44.2597 343H37.1614ZM52.3719 343C52.0958 343 51.8719 343.224 51.8719 343.5C51.8719 343.776 52.0958 344 52.3719 344H59.4702C59.7463 344 59.9702 343.776 59.9702 343.5C59.9702 343.224 59.7463 343 59.4702 343H52.3719ZM89.8912 344C90.1674 344 90.3912 343.776 90.3912 343.5C90.3912 343.224 90.1674 343 89.8912 343H82.793C82.5168 343 82.293 343.224 82.293 343.5C82.293 343.776 82.5168 344 82.793 344H89.8912ZM98.0035 343C97.7274 343 97.5035 343.224 97.5035 343.5C97.5035 343.776 97.7274 344 98.0035 344H105.102C105.378 344 105.602 343.776 105.602 343.5C105.602 343.224 105.378 343 105.102 343H98.0035ZM128.425 343C128.148 343 127.925 343.224 127.925 343.5C127.925 343.776 128.148 344 128.425 344H135.523C135.799 344 136.023 343.776 136.023 343.5C136.023 343.224 135.799 343 135.523 343H128.425ZM165.944 344C166.22 344 166.444 343.776 166.444 343.5C166.444 343.224 166.22 343 165.944 343H158.846C158.569 343 158.346 343.224 158.346 343.5C158.346 343.776 158.569 344 158.846 344H165.944ZM174.056 343C173.78 343 173.556 343.224 173.556 343.5C173.556 343.776 173.78 344 174.056 344H181.154C181.431 344 181.654 343.776 181.654 343.5C181.654 343.224 181.431 343 181.154 343H174.056ZM204.477 343C204.201 343 203.977 343.224 203.977 343.5C203.977 343.776 204.201 344 204.477 344H211.575C211.852 344 212.075 343.776 212.075 343.5C212.075 343.224 211.852 343 211.575 343H204.477ZM241.996 344C242.273 344 242.496 343.776 242.496 343.5C242.496 343.224 242.273 343 241.996 343H234.898C234.622 343 234.398 343.224 234.398 343.5C234.398 343.776 234.622 344 234.898 344H241.996ZM250.109 343C249.833 343 249.609 343.224 249.609 343.5C249.609 343.776 249.833 344 250.109 344H257.207C257.483 344 257.707 343.776 257.707 343.5C257.707 343.224 257.483 343 257.207 343H250.109ZM280.53 343C280.254 343 280.03 343.224 280.03 343.5C280.03 343.776 280.254 344 280.53 344H287.628C287.904 344 288.128 343.776 288.128 343.5C288.128 343.224 287.904 343 287.628 343H280.53ZM295.74 344H302.839C303.115 344 303.339 343.776 303.339 343.5C303.339 343.224 303.115 343 302.839 343H295.74C295.464 343 295.24 343.224 295.24 343.5C295.24 343.776 295.464 344 295.74 344ZM310.951 343C310.675 343 310.451 343.224 310.451 343.5C310.451 343.776 310.675 344 310.951 344H314.5C314.776 344 315 343.776 315 343.5C315 343.224 314.776 343 314.5 343H310.951ZM219.688 343C219.412 343 219.188 343.224 219.188 343.5C219.188 343.776 219.412 344 219.688 344H226.786C227.062 344 227.286 343.776 227.286 343.5C227.286 343.224 227.062 343 226.786 343H219.688ZM143.635 343C143.359 343 143.135 343.224 143.135 343.5C143.135 343.776 143.359 344 143.635 344H150.733C151.009 344 151.233 343.776 151.233 343.5C151.233 343.224 151.009 343 150.733 343H143.635ZM67.5825 343C67.3063 343 67.0825 343.224 67.0825 343.5C67.0825 343.776 67.3063 344 67.5825 344H74.6807C74.9568 344 75.1807 343.776 75.1807 343.5C75.1807 343.224 74.9568 343 74.6807 343H67.5825ZM113.214 343C112.938 343 112.714 343.224 112.714 343.5C112.714 343.776 112.938 344 113.214 344H120.312C120.588 344 120.812 343.776 120.812 343.5C120.812 343.224 120.588 343 120.312 343H113.214ZM189.267 343C188.991 343 188.767 343.224 188.767 343.5C188.767 343.776 188.991 344 189.267 344H196.365C196.641 344 196.865 343.776 196.865 343.5C196.865 343.224 196.641 343 196.365 343H189.267ZM265.319 343C265.043 343 264.819 343.224 264.819 343.5C264.819 343.776 265.043 344 265.319 344H272.418C272.694 344 272.918 343.776 272.918 343.5C272.918 343.224 272.694 343 272.418 343H265.319Z" 
                        fill={isDarkMode ? "#FFFFFF26" : "#E5E7EB"}
                        stroke={isDarkMode ? "#FFFFFF26" : "#D1D5DB"}
                        strokeWidth="1"
                    />
                </svg>
                <Box className='absolute left-4 top-8 flex gap-2 max-w-[280px]'>
                    <img src={getItemImage()} alt='Event' className='h-16 w-16 rounded object-cover flex-shrink-0' />
                    <Box className='flex flex-col justify-between min-w-0 flex-1'>
                        <Chip
                            label={getItemCategory()}
                            className={`h-5 w-auto text-xs px-1 ${isDarkMode ? 'bg-blue-500 bg-opacity-20 text-blue-500' : 'bg-blue-100 text-blue-600'}`}
                        />
                        <Typography variant='h6' className={`line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {getItemTitle()}
                        </Typography>
                        <Box className={`flex h-6 items-center gap-1 ${isDarkMode ? 'text-[#AAAAAA]' : 'text-blue-600'}`}>
                            <LocationOn className={`text-xs ${isDarkMode ? 'text-[#AAAAAA]' : 'text-blue-600'}`} />
                            <Typography className={`line-clamp-1 text-xs ${isDarkMode ? 'text-[#AAAAAA]' : 'text-blue-600'}`}>{getItemLocation()}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box className='absolute left-4 right-4 top-36 flex flex-col gap-2.5'>
                    <Box>
                        <Typography className={`text-xs font-medium ${isDarkMode ? 'text-[#AAAAAA]' : 'text-gray-600'}`}>Name</Typography>
                        <Typography variant='body2' className={`line-clamp-1 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {bookingFlow.first_name} {bookingFlow.last_name}
                        </Typography>
                    </Box>
                    <Box className='flex justify-between'>
                        <Box className='flex-1'>
                            <Typography className={`text-xs font-medium ${isDarkMode ? 'text-[#AAAAAA]' : 'text-gray-600'}`}>Venue</Typography>
                            <Typography variant='body2' className={`line-clamp-1 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {getItemLocation()}
                            </Typography>
                        </Box>
                        <Box className='ml-2 flex-1'>
                            <Typography className={`font-jakarta text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Seat</Typography>
                            <Typography variant='body2' className={`line-clamp-1 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {bookingFlow.selected_seats.map(seat => `${String.fromCharCode(65 + seat.row)}${seat.column + 1}`).join(', ') || 'No seats selected'}
                            </Typography>
                        </Box>
                    </Box>
                    <Box className='flex justify-between'>
                        <Box className='flex-1'>
                            <Typography className={`font-jakarta text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date</Typography>
                            <Typography variant='body2' className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatDate(getItemDate())}</Typography>
                        </Box>
                        <Box className='ml-2 flex-1'>
                            <Typography className={`font-jakarta text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time</Typography>
                            <Typography variant='body2' className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{eventTime}</Typography>
                        </Box>
                    </Box>
                    <Box className='flex items-center justify-between'>
                        <Box>
                            <Typography className={`font-jakarta text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Booking ID
                            </Typography>
                            <Typography variant='body2' className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{bookingFlow.booking_id || 'Pending...'}</Typography>
                        </Box>
                        {bookingFlow.booking_id && (
                            <Box
                                className='flex items-center gap-2'
                                onClick={handleCopyBookingId}
                                style={{ cursor: 'pointer' }}
                            >
                                <ContentCopyIcon className={`text-xs ${isDarkMode ? 'text-[#AAAAAA]' : 'text-blue-500'}`} />
                                <Typography variant='body2' className={`text-sm font-jakarta ${isDarkMode ? 'text-gray-400' : 'text-blue-500'}`}>
                                    Copy
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Box className='absolute -bottom-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1'>
                        <Typography className={`font-jakarta text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Price</Typography>
                        <Typography className={`font-jakarta text-lg font-bold ${isDarkMode ? 'text-blue-500' : 'text-blue-500'}`}>
                            ${getTotalPrice().toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box className='flex w-full flex-col gap-4 flex-1'>
                <TextField
                    placeholder='Promo code'
                    value={bookingFlow.promo_code || ''}
                    onChange={e => setBookingData({ promo_code: e.target.value })}
                    InputProps={{
                        startAdornment: <ConfirmationNumber className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />,
                    }}
                    fullWidth
                />

                <FormControl fullWidth>
                    <InputLabel className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Payment method</InputLabel>
                    <Select
                        value={bookingFlow.payment_method || (paymentCards?.find(card => card.is_default) ? `card_${paymentCards.find(card => card.is_default)?.id}` : '')}
                        onChange={e => setBookingData({ payment_method: e.target.value })}
                        startAdornment={<CreditCard className={`mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />}
                        label='Payment method'
                    >
                        <MenuItem value=''>Select payment method</MenuItem>
                        {paymentCards?.map(card => (
                            <MenuItem key={card.id} value={`card_${card.id}`}>
                                {card.card_type.toUpperCase()} ****{card.last_four_digits}
                                {card.is_default && ' (Default)'}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Box className='mt-8 w-full'>
                <Button
                    variant='contained'
                    onClick={handlePayment}
                    disabled={!bookingFlow.payment_method || cardsLoading || createBookingMutation.isPending}
                    size='large'
                    className='w-full h-12 bg-primary hover:bg-primary/90 text-white disabled:bg-gray-300 disabled:text-gray-500'
                >
                    {createBookingMutation.isPending ? 'Processing...' : 'Pay Now'}
                </Button>
            </Box>
            </Container>
        </>
    );
}

export default Summary;

