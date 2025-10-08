import { format, parseISO, isValid, differenceInDays, isToday, isTomorrow } from 'date-fns';

export const formatEventRange = (start?: string | Date, end?: string | Date) => {
    if (!start || !end) return '';

    const parse = (d: string | Date) => (typeof d === 'string' ? parseISO(d) : d);

    const startDate = parse(start);
    const endDate = parse(end);

    if (!isValid(startDate) || !isValid(endDate)) return '';

    return `${format(startDate, 'dd')} - ${format(endDate, 'dd MMM yyyy')}`;
};

export const formatSmartDate = (date: string | Date, includeTime: boolean = false): string => {
    if (!date) return '';

    const parse = (d: string | Date) => (typeof d === 'string' ? parseISO(d) : d);
    const eventDate = parse(date);

    if (!isValid(eventDate)) return '';

    const now = new Date();
    const diffDays = differenceInDays(eventDate, now);

    let dateStr: string;

    if (isToday(eventDate)) {
        dateStr = 'Today';
    } else if (isTomorrow(eventDate)) {
        dateStr = 'Tomorrow';
    } else if (diffDays > 0 && diffDays <= 7) {
        dateStr = `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays > 7 && diffDays <= 30) {
        dateStr = format(eventDate, 'MMM d');
    } else {
        dateStr = format(eventDate, 'MMM d, yyyy');
    }

    if (includeTime) {
        const timeStr = format(eventDate, 'h:mm a');
        return `${dateStr} • ${timeStr}`;
    }

    return dateStr;
};

export const formatPrice = (price: number | undefined): string => {
    if (price === undefined || price === null) return 'Free';
    if (price === 0) return 'Free';
    return `$${Math.round(price)}`;
};
