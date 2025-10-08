import { useState } from 'react';

interface UsePaginationProps {
    initialCount?: number;
    increment?: number;
}

export const usePagination = ({ 
    initialCount = 10, 
    increment = 10 
}: UsePaginationProps = {}) => {
    const [visibleCount, setVisibleCount] = useState(initialCount);

    const loadMore = () => {
        setVisibleCount(prev => prev + increment);
    };

    const reset = () => {
        setVisibleCount(initialCount);
    };

    const getVisibleItems = <T>(items: T[]): T[] => {
        return items.slice(0, visibleCount);
    };

    const hasMore = (totalCount: number): boolean => {
        return totalCount > visibleCount;
    };

    const getRemainingCount = (totalCount: number): number => {
        return totalCount - visibleCount;
    };

    return {
        visibleCount,
        loadMore,
        reset,
        getVisibleItems,
        hasMore,
        getRemainingCount
    };
};

