import { create } from 'zustand';
import type { FilterState, EventType, DateFilter } from '@/utils/filterUtils';
import { categories } from '@/utils/filterUtils';

interface FiltersState extends FilterState {
  categories: Array<{ name: string; iconName: string }>;
  
  setCategoryFilter: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setLocationFilter: (location: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setEventType: (type: EventType) => void;
  setDateFilter: (filter: DateFilter) => void;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  categoryFilter: 'All',
  searchQuery: '',
  locationFilter: '',
  priceRange: [0, 500],
  minPrice: 0,
  maxPrice: 500,
  eventType: 'Any',
  dateFilter: 'Upcoming',
};

export const useFiltersStore = create<FiltersState>((set, get) => ({
  ...initialFilters,
  categories,
  
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLocationFilter: (location) => set({ locationFilter: location }),
  setPriceRange: (range) => set({ 
    priceRange: range, 
    minPrice: range[0], 
    maxPrice: range[1] 
  }),
  setMinPrice: (price) => set((state) => ({ 
    minPrice: price, 
    priceRange: [price, state.maxPrice] 
  })),
  setMaxPrice: (price) => set((state) => ({ 
    maxPrice: price, 
    priceRange: [state.minPrice, price] 
  })),
  setEventType: (type) => set({ eventType: type }),
  setDateFilter: (filter) => set({ dateFilter: filter }),
  resetFilters: () => set(initialFilters),
}));
