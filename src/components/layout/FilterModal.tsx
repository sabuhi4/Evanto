import React from 'react';
import { Modal, Box, Button, Chip, Container, Slider, Stack, Typography } from '@mui/material';
import { useFiltersStore } from '@/store/filtersStore';
import { useUserStore } from '@/store/userStore';
import { LocationPicker } from '@/components/forms/LocationPicker';

interface FilterModalProps {
    open: boolean;
    onClose: () => void;
}

export const FilterModal = ({ open, onClose }: FilterModalProps) => {
    const isDarkMode = useUserStore(state => state.isDarkMode);
    const {
        categories,
        categoryFilter,
        setCategoryFilter,
        minPrice,
        maxPrice,
        setMinPrice,
        setMaxPrice,
        eventType,
        setEventType,
        dateFilter,
        setDateFilter,
        locationFilter,
        setLocationFilter,
        resetFilters
    } = useFiltersStore();

    const handleReset = () => {
        resetFilters();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            className="flex items-end justify-center"
        >
            <Box className={`w-96 ${isDarkMode ? 'bg-neutral-800' : 'bg-white'} rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto`}>
                <Container className='flex h-[665px] flex-col gap-4 rounded-t-3xl border-2 p-6'>
                    <Typography variant='h4' className='mb-6 text-primary'>
                        Filter
                    </Typography>
                    
                    <LocationPicker value={locationFilter} onChange={setLocationFilter} />
                    
                    <Typography variant='h6' className='-mb-2 self-start text-primary'>
                        Category
                    </Typography>
                    <Stack
                        direction='row'
                        spacing={1}
                        flexWrap='wrap'
                        useFlexGap
                        alignItems='flex-start'
                        justifyContent='flex-start'
                        rowGap={1}
                    >
                        {categories.map(({ name, iconName }) => (
                            <Chip
                                size='medium'
                                key={name}
                                label={name}
                                clickable
                                color={categoryFilter === name ? 'primary' : 'default'}
                                onClick={() => setCategoryFilter(categoryFilter === name ? 'All' : name)}
                                className='cursor-pointer p-1'
                            />
                        ))}
                    </Stack>
                    
                    <Typography variant='h4' className='mb-4 mt-4 self-start text-primary'>
                        Ticket Price Range
                    </Typography>
                    <Slider
                        value={[minPrice, maxPrice]}
                        onChange={(_, newValue) => {
                            const [newMin, newMax] = newValue as number[];
                            setMinPrice(newMin);
                            setMaxPrice(newMax);
                        }}
                        valueLabelDisplay='on'
                        min={0}
                        max={500}
                        className='text-primary'
                    />
                    
                    <Typography variant='h6' className='-mb-2 self-start text-primary'>
                        Event Type
                    </Typography>
                    <Stack direction={'row'} spacing={2} className='self-start'>
                        <Button
                            variant={eventType === 'Events' ? 'contained' : 'outlined'}
                            onClick={() => setEventType('Events')}
                            className='h-9 whitespace-nowrap p-3 font-jakarta text-xs font-medium'
                        >
                            Events
                        </Button>
                        <Button
                            variant={eventType === 'Meetups' ? 'contained' : 'outlined'}
                            onClick={() => setEventType('Meetups')}
                            className='h-9 whitespace-nowrap p-3 font-jakarta text-xs font-medium'
                        >
                            Meetups
                        </Button>
                        <Button
                            variant={eventType === 'Any' ? 'contained' : 'outlined'}
                            onClick={() => setEventType('Any')}
                            className='h-9 whitespace-nowrap p-3 font-jakarta text-xs font-medium'
                        >
                            Any Type
                        </Button>
                    </Stack>
                    
                    <Typography variant='h6' className='-mb-2 self-start text-primary'>
                        Date
                    </Typography>
                    <Stack direction={'row'} spacing={2} className='self-start'>
                        <Button
                            variant={dateFilter === 'Today' ? 'contained' : 'outlined'}
                            onClick={() => setDateFilter('Today')}
                            className='h-9 whitespace-nowrap p-3 font-jakarta text-xs font-medium'
                        >
                            Today
                        </Button>
                        <Button
                            variant={dateFilter === 'Tomorrow' ? 'contained' : 'outlined'}
                            onClick={() => setDateFilter('Tomorrow')}
                            className='h-9 whitespace-nowrap p-3 font-jakarta text-xs font-medium'
                        >
                            Tomorrow
                        </Button>
                        <Button
                            variant={dateFilter === 'This Week' ? 'contained' : 'outlined'}
                            onClick={() => setDateFilter('This Week')}
                            className='h-9 whitespace-nowrap p-3 font-jakarta text-xs font-medium'
                        >
                            This Week
                        </Button>
                    </Stack>
                    
                    <Stack direction={'row'} spacing={2} className='mt-6 w-full'>
                        <Button variant='outlined' className='h-12 bg-primary/10' onClick={handleReset}>
                            Reset
                        </Button>
                        <Button variant='contained' className='h-12' onClick={onClose}>
                            Done
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Modal>
    );
}

