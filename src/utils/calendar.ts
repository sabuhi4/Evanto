export const generateICalFile = (eventData: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location?: string;
}) => {
    const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Evanto//Event Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@evanto.com`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(eventData.startDate)}`,
        `DTEND:${formatDate(eventData.endDate)}`,
        `SUMMARY:${eventData.title}`,
        `DESCRIPTION:${eventData.description.replace(/\n/g, '\\n')}`,
        eventData.location ? `LOCATION:${eventData.location}` : '',
        'STATUS:CONFIRMED',
        'SEQUENCE:0',
        'END:VEVENT',
        'END:VCALENDAR'
    ].filter(line => line !== '').join('\r\n');

    return icsContent;
};

export const downloadCalendarFile = (icsContent: string, filename: string) => {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};
