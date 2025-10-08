import { isToday, isTomorrow, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import type { UnifiedItem } from '@/utils/schemas';

export type EventType = 'Any' | 'Events' | 'Meetups';
export type DateFilter = 'Upcoming' | 'All' | 'Today' | 'Tomorrow' | 'This Week' | 'Past';

export interface FilterState {
  categoryFilter: string;
  searchQuery: string;
  locationFilter: string;
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  eventType: EventType;
  dateFilter: DateFilter;
}

export const categories = [
  { name: 'All', iconName: 'apps' },
  { name: 'Music', iconName: 'music_note' },
  { name: 'Sport', iconName: 'sports_soccer' },
  { name: 'Art', iconName: 'brush' },
  { name: 'Education', iconName: 'school' },
  { name: 'Tech', iconName: 'computer' },
  { name: 'Food', iconName: 'restaurant' },
  { name: 'Other', iconName: 'more_horiz' },
];

export const hasActiveFilters = (filters: FilterState) => {
  return (
    filters.categoryFilter !== 'All' ||
    filters.searchQuery.trim() !== '' ||
    filters.locationFilter.trim() !== '' ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 500 ||
    filters.eventType !== 'Any' ||
    filters.dateFilter !== 'Upcoming'
  );
};

export const getFilteredItems = (items: UnifiedItem[], filters: FilterState): UnifiedItem[] => {
  return items.filter(item => {
    if (filters.dateFilter !== 'All') {
      const itemDate = item.start_date;
      if (!itemDate) return false;
      
      const date = new Date(itemDate);
      const now = new Date();
      
      switch (filters.dateFilter) {
        case 'Upcoming':
          if (date <= now) return false;
          break;
        case 'Past':
          if (date >= now) return false;
          break;
        case 'Today':
          if (!isToday(date)) return false;
          break;
        case 'Tomorrow':
          if (!isTomorrow(date)) return false;
          break;
        case 'This Week':
          const weekStart = startOfWeek(now, { weekStartsOn: 1 });
          const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
          if (!isWithinInterval(date, { start: weekStart, end: weekEnd })) return false;
          break;
      }
    }
    
    if (filters.categoryFilter !== 'All') {
      const categoryMatch = item.category && 
        item.category.toLowerCase() === filters.categoryFilter.toLowerCase();
      if (!categoryMatch) return false;
    }
    
    if (filters.searchQuery.trim() !== '') {
      const title = item.title;
      const description = item.description;
      const searchLower = filters.searchQuery.toLowerCase().trim();
      
      if (!title?.toLowerCase().includes(searchLower) && 
          !description?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }
    
    const price = item.type === 'event' ? (item.ticket_price ?? 0) : 0;
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
    
    if (filters.eventType !== 'Any') {
      if (filters.eventType === 'Events' && item.type !== 'event') return false;
      if (filters.eventType === 'Meetups' && item.type !== 'meetup') return false;
    }
    
    if (filters.locationFilter.trim() !== '') {
      const itemLocation = item.location ?? '';
      if (!itemLocation.toLowerCase().includes(filters.locationFilter.toLowerCase().trim())) {
        return false;
      }
    }
    
    return true;
  });
};

