import { Box, TextField } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';
import { format, parseISO, isValid } from 'date-fns';

interface DateTimePickerProps {
    label?: string;
    value: Date;
    onChange: Dispatch<SetStateAction<Date>>;
}

export const DateTimePicker = ({ label, value, onChange }: DateTimePickerProps) => {
    const formatDateTimeForInput = (date: Date) => {
        return format(date, "yyyy-MM-dd'T'HH:mm");
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const parsedDate = parseISO(event.target.value);
        if (isValid(parsedDate)) {
            onChange(parsedDate);
        }
    };

    return (
        <Box className='w-full'>
            <TextField
                label={label || 'Select date and time'}
                type="datetime-local"
                value={formatDateTimeForInput(value)}
                onChange={handleChange}
                fullWidth
                className="rounded-full h-14 border-neutral-200 hover:border-neutral-300 focus:border-blue-500"
            />
        </Box>
    );
};
