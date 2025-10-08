import React, { useEffect, useState } from 'react';
import { 
    CreditCardOutlined, 
    CropFree, 
    KeyboardArrowLeftOutlined,
    Visibility,
    VisibilityOff,
    CheckCircle,
    CreditCard
} from '@mui/icons-material';
import { 
    Box, 
    Button, 
    IconButton, 
    TextField, 
    Typography, 
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    InputAdornment
} from '@mui/material';
import { Container } from '@mui/material';
import { useCreatePaymentCard, useUpdatePaymentCard } from '@/hooks/usePaymentCards';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/utils/supabase';
import { showSuccess, showError } from '@/utils/notifications';
import { useUserStore } from '@/store/userStore';

// Form-specific schema for payment card input
const paymentCardFormSchema = z.object({
    card_holder: z.string().min(1, 'Card holder name is required'),
    card_number: z
        .string()
        .min(16, 'Card number must be 16 digits')
        .max(19, 'Card number too long')
        .regex(/^[0-9\s]+$/, 'Card number must contain only numbers'),
    expiry_date: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Expiry date must be in MM/YY format'),
    cvv: z
        .string()
        .min(3, 'CVV must be 3 digits')
        .max(4, 'CVV must be 3-4 digits')
        .regex(/^[0-9]+$/, 'CVV must contain only numbers'),
    card_type: z.enum(['visa', 'mastercard', 'amex', 'discover', 'other']),
});

type PaymentCardFormData = z.infer<typeof paymentCardFormSchema>;

function PaymentDetails() {
    const navigate = useNavigate();
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const [searchParams] = useSearchParams();
    const editCardId = searchParams.get('edit');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [cardType, setCardType] = useState('mastercard');

    const { mutate: createCard, isPending: isCreating } = useCreatePaymentCard();
    const { mutate: updateCard, isPending: isUpdating } = useUpdatePaymentCard();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isValid },
        setValue,
        trigger
    } = useForm({
        resolver: zodResolver(paymentCardFormSchema),
        defaultValues: {
            card_holder: '',
            card_number: '',
            expiry_date: '',
            cvv: '',
            card_type: 'mastercard' as const,
        },
        mode: 'onChange'
    });

    const formData = watch();

    // Auto-detect card type based on card number
    const detectCardType = (cardNumber: string) => {
        const cleanNumber = cardNumber.replace(/\s/g, '');
        if (cleanNumber.startsWith('4')) {
            setCardType('visa');
            setValue('card_type', 'visa');
        } else if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) {
            setCardType('mastercard');
            setValue('card_type', 'mastercard');
        }
    };

    // Enhanced card number formatting
    const formatCardNumber = (value: string) => {
        const cleanValue = value.replace(/\D/g, '').slice(0, 16);
        const formatted = cleanValue.replace(/(.{4})/g, '$1 ').trim();
        return formatted;
    };

    // Enhanced expiry date formatting
    const formatExpiryDate = (value: string) => {
        const cleanValue = value.replace(/\D/g, '').slice(0, 4);
        if (cleanValue.length > 2) {
            return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2, 4);
        }
        return cleanValue;
    };

    // Validate expiry date
    const validateExpiryDate = (expiry: string) => {
        if (!expiry) return true;
        const [month, year] = expiry.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const cardMonth = parseInt(month);
        const cardYear = parseInt(year);
        
        if (cardYear < currentYear || (cardYear === currentYear && cardMonth < currentMonth)) {
            return false;
        }
        return true;
    };

    // Fetch card data if editing
    useEffect(() => {
        if (editCardId) {
            setIsEditing(true);
            setIsLoading(true);
            
            const fetchCardData = async () => {
                try {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) {
                        showError('User not authenticated');
                        navigate('/auth/sign-in');
                        return;
                    }

                    const { data, error } = await supabase
                        .from('payment_methods')
                        .select('*')
                        .eq('id', editCardId)
                        .eq('user_id', user.id)
                        .single();

                    if (error) {
                        showError('Failed to fetch card data');
                        navigate('/payments/cards');
                        return;
                    }

                    if (data) {
                        setCardType(data.card_type);
                        // Format expiry date from month/year to MM/YY
                        const expiryDate = data.expiry_month && data.expiry_year 
                            ? `${data.expiry_month.toString().padStart(2, '0')}/${data.expiry_year.toString().slice(-2)}`
                            : '';
                        
                        reset({
                            card_holder: '', // Not stored in DB for security
                            card_number: `**** **** **** ${data.last_four_digits}`, // Show masked number
                            expiry_date: expiryDate,
                            cvv: '', // Not stored in DB for security
                            card_type: data.card_type,
                        });
                    }
                } catch (error) {
                    showError('Failed to fetch card data');
                    navigate('/payments/cards');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCardData();
        }
    }, [editCardId, reset, navigate]);

    const onSubmit = (data: PaymentCardFormData) => {
        if (isEditing && editCardId) {
            // For editing, only update non-sensitive fields like expiry date
            updateCard(
                { 
                    id: editCardId, 
                    data: {
                        card_type: data.card_type,
                        expiry_month: parseInt(data.expiry_date.split('/')[0]),
                        expiry_year: parseInt('20' + data.expiry_date.split('/')[1]),
                        is_default: false
                    }
                },
                {
                    onSuccess: () => {
                        showSuccess('Card updated successfully');
                        navigate('/payments/cards');
                    },
                    onError: () => {
                        showError('Failed to update card');
                    },
                }
            );
        } else {
            // Transform form data to match createPaymentCard expectations
            const [expiryMonth, expiryYear] = data.expiry_date.split('/');
            const lastFourDigits = data.card_number.replace(/\s/g, '').slice(-4);
            
            const transformedData = {
                type: 'card', // Fixed value for card type
                card_type: data.card_type,
                last_four_digits: lastFourDigits,
                expiry_month: parseInt(expiryMonth),
                expiry_year: parseInt('20' + expiryYear), // Convert YY to YYYY
            };
            
            createCard(transformedData, {
                onSuccess: () => {
                        showSuccess('Card added successfully');
                        navigate('/payments/cards');
                    },
                    onError: () => {
                        showError('Failed to add card');
                },
            });
        }
    };

    const getCardTypeIcon = (cardType: string) => {
        switch (cardType.toLowerCase()) {
            case 'mastercard':
                return <CreditCard />;
            case 'visa':
                return <CreditCard />;
            default:
                return <CreditCardOutlined />;
        }
    };

    const getCardTypeColor = (cardType: string) => {
        switch (cardType.toLowerCase()) {
            case 'mastercard':
                return '#FF5F00';
            case 'visa':
                return '#1A1F71';
            default:
                return '#666';
        }
    };

    if (isLoading) {
        return (
            <>
                <Container className="relative min-h-screen">
                    <Box className={'mb-8 flex w-full items-center justify-between'}>
                        <IconButton size='medium' onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400 border border-neutral-200 bg-gray-100 dark:bg-gray-700" sx={{ borderRadius: '50%' }}>
                            <KeyboardArrowLeftOutlined />
                        </IconButton>
                        <Typography variant='h4' className={`font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {isEditing ? 'Edit Card' : 'Add New Card'}
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
                <Box className={'mb-8 flex w-full items-center justify-between'}>
                    <IconButton size='medium' onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-400 border border-neutral-200 bg-gray-100 dark:bg-gray-700" sx={{ borderRadius: '50%' }}>
                        <KeyboardArrowLeftOutlined />
                    </IconButton>
                    <Typography variant='h4' className={`font-poppins font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {isEditing ? 'Edit Card' : 'Add New Card'}
                    </Typography>
                    <IconButton 
                        className="text-blue-500 bg-blue-50 border border-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 hover:scale-105"
                        onClick={() => {
                            // TODO: Implement card scanning functionality
                            showSuccess('Card scanning feature coming soon!');
                        }}
                        title="Scan Card Details"
                    >
                        <CropFree className="text-xl" />
                    </IconButton>
                </Box>
            
                {/* Enhanced Preview Card */}
                <Box className="w-full mb-4">
                    <Box
                        className="h-48 w-full rounded-2xl relative overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        style={{
                            background: `linear-gradient(135deg, ${getCardTypeColor(cardType)} 0%, ${getCardTypeColor(cardType)}dd 100%)`,
                        }}
                    >
                        {/* Card Content */}
                        <Box className="relative z-30 flex h-full flex-col justify-between p-6 gap-2 text-white">
                            <Box className="flex items-start justify-between">
                                <Typography variant='body2' className="text-sm font-medium">
                                    Credit
                                </Typography>
                                <Box className="h-8 w-8">
                                    {getCardTypeIcon(cardType)}
                                </Box>
                            </Box>

                            <Box className="flex items-end justify-between">
                                <Box className="flex flex-col gap-0.5">
                                    <Typography className="font-medium text-base">
                                        {formData.card_holder || 'Card Holder'}
                                    </Typography>
                                    <Typography className="font-mono tracking-wider text-base">
                                        {formData.card_number || '•••• •••• •••• ••••'}
                                    </Typography>
                                </Box>

                                <Box className="text-right">
                                    <Typography variant='caption' className="opacity-80">
                                        Valid date
                                    </Typography>
                                    <Typography className="font-medium text-base">
                                        {formData.expiry_date || 'MM/YY'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                </Box>
            </Box>
            
            <form onSubmit={handleSubmit(onSubmit)} className='flex w-full flex-col gap-4'>
                
                {/* Card Type Selection */}
                <FormControl fullWidth>
                    <InputLabel className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Card Type</InputLabel>
                    <Select
                        value={cardType}
                        label="Card Type"
                        onChange={(e) => {
                            setCardType(e.target.value);
                            setValue('card_type', e.target.value as 'mastercard' | 'visa');
                        }}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        sx={{
                            '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: isDarkMode ? '#374151' : '#d1d5db',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#3b82f6',
                            },
                            color: isDarkMode ? '#ffffff' : '#111827',
                            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                        }}
                    >
                        <MenuItem value="mastercard">
                            <CreditCard style={{ height: 20, width: 20 }} />
                            Mastercard
                        </MenuItem>
                        <MenuItem value="visa">
                            <CreditCard style={{ height: 20, width: 20 }} />
                            Visa
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* Card Holder */}
                <TextField
                    label='Card Holder Name'
                    placeholder={isEditing ? 'Enter new card holder name' : 'John Doe'}
                    {...register('card_holder')}
                    error={!!errors.card_holder}
                    helperText={isEditing ? 'Enter the new card holder name' : errors.card_holder?.message}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: isDarkMode ? '#374151' : '#d1d5db',
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#3b82f6',
                            },
                            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                        },
                        '& .MuiInputLabel-root': {
                            color: isDarkMode ? '#9ca3af' : '#6b7280',
                        },
                        '& .MuiInputBase-input': {
                            color: isDarkMode ? '#ffffff' : '#111827',
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CreditCardOutlined sx={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Card Number */}
                <TextField
                    label='Card Number'
                    placeholder={isEditing ? 'Enter new card number' : '1234 5678 9012 3456'}
                    {...register('card_number')}
                    error={!!errors.card_number}
                    helperText={isEditing ? 'Enter the new card number' : errors.card_number?.message}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        e.target.value = formatted;
                        detectCardType(formatted);
                        setValue('card_number', formatted);
                        trigger('card_number');
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: isDarkMode ? '#374151' : '#d1d5db',
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#3b82f6',
                            },
                            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                        },
                        '& .MuiInputLabel-root': {
                            color: isDarkMode ? '#9ca3af' : '#6b7280',
                        },
                        '& .MuiInputBase-input': {
                            color: isDarkMode ? '#ffffff' : '#111827',
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {getCardTypeIcon(cardType)}
                            </InputAdornment>
                        ),
                    }}
                />

                {/* CVV and Expiry Date Row */}
                <Box className='flex gap-2'>
                    <TextField
                        label='CVV'
                        placeholder={isEditing ? 'Enter new CVV' : '123'}
                        type={showPassword ? 'text' : 'password'}
                        {...register('cvv')}
                        error={!!errors.cvv}
                        helperText={isEditing ? 'Enter the new CVV' : errors.cvv?.message}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: isDarkMode ? '#374151' : '#d1d5db',
                                },
                                '&:hover fieldset': {
                                    borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#3b82f6',
                                },
                                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                            },
                            '& .MuiInputLabel-root': {
                                color: isDarkMode ? '#9ca3af' : '#6b7280',
                            },
                            '& .MuiInputBase-input': {
                                color: isDarkMode ? '#ffffff' : '#111827',
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        label='Expiry Date'
                        placeholder='MM/YY'
                        {...register('expiry_date')}
                        error={!!errors.expiry_date || !validateExpiryDate(formData.expiry_date)}
                        helperText={
                            errors.expiry_date?.message || 
                            (!validateExpiryDate(formData.expiry_date) && formData.expiry_date ? 'Card has expired' : '')
                        }
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        onChange={(e) => {
                            const formatted = formatExpiryDate(e.target.value);
                            e.target.value = formatted;
                            setValue('expiry_date', formatted);
                            trigger('expiry_date');
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: isDarkMode ? '#374151' : '#d1d5db',
                                },
                                '&:hover fieldset': {
                                    borderColor: isDarkMode ? '#6b7280' : '#9ca3af',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#3b82f6',
                                },
                                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                            },
                            '& .MuiInputLabel-root': {
                                color: isDarkMode ? '#9ca3af' : '#6b7280',
                            },
                            '& .MuiInputBase-input': {
                                color: isDarkMode ? '#ffffff' : '#111827',
                            },
                        }}
                    />
                </Box>

                {/* Validation Status */}
                {Object.keys(errors).length > 0 && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                        Please fix the errors above to continue
                    </Alert>
                )}

                {/* Edit Mode Notice */}
                {isEditing && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                        <Typography variant="body2">
                            <strong>Editing Mode:</strong> For security reasons, sensitive card information is not stored. 
                            You can update the card type and expiry date, but you'll need to re-enter the card number and CVV.
                        </Typography>
                    </Alert>
                )}

                {/* Security Info */}
                <Box className={`p-4 rounded-lg border ${
                    isDarkMode 
                        ? 'bg-gray-800 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                }`}>
                    <Box className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-green-500 text-base" />
                        <Typography variant="caption" className={`font-medium ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Secure Payment
                        </Typography>
                    </Box>
                    <Typography variant="caption" className={
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }>
                        Your card information is encrypted and secure. We never store your CVV.
                    </Typography>
                </Box>

                <Button 
                    variant='contained' 
                    type='submit' 
                    disabled={!isValid || isCreating || isUpdating}
                    className={`mt-auto w-full h-14 font-poppins font-medium text-base rounded-lg ${
                        isDarkMode 
                            ? 'bg-primary hover:bg-primary-dark text-white' 
                            : 'bg-primary hover:bg-primary-dark text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {isCreating || isUpdating 
                        ? (isEditing ? 'Updating...' : 'Saving...') 
                        : (isEditing ? 'Update Card' : 'Add Card')
                    }
                </Button>
            </form>
            </Container>
        </>
    );
}

export default PaymentDetails;

