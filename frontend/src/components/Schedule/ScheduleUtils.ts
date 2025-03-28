//ScheduleUtils.ts
export interface TimeBlock {
    id: string;
    startTime: string;
    endTime: string;
    label: string;
    description?: string;
    color?: string;
    date: string; // ISO format date (YYYY-MM-DD)
}

export interface ScheduleData {
    schedule: TimeBlock[];
}

export const DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

export const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
};

export const validateTimeRange = (startTime: string, endTime: string): boolean => {
    if (!validateTimeFormat(startTime) || !validateTimeFormat(endTime)) {
        return false;
    }

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    return end > start;
};

export const convertScheduleToJSON = (schedule: TimeBlock[]): string => {
    const data: ScheduleData = { schedule };
    return JSON.stringify(data, null, 2);
};

export const parseScheduleFromJSON = (jsonData: string): TimeBlock[] => {
    try {
        const data: ScheduleData = JSON.parse(jsonData);
        if (!data.schedule || !Array.isArray(data.schedule)) {
            throw new Error('Invalid schedule format');
        }

        // Ensure backward compatibility with schedules that don't have date property
        return data.schedule.map(block => {
            // If there's no date but there's a day property (from previous version)
            if (!block.date && (block as any).day) {
                // Get the next occurrence of that day
                const day = (block as any).day;
                const date = getNextDayOccurrence(day);
                return {
                    ...block,
                    date
                };
            }

            // If there's no date at all, set to today
            if (!block.date) {
                const today = new Date();
                return {
                    ...block,
                    date: formatDateToISO(today)
                };
            }

            return block;
        });
    } catch (error) {
        console.error('Error parsing schedule JSON:', error);
        return [];
    }
};

// Date helper functions
export const formatDateToISO = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

// Get today's date in ISO format
export const getTodayISO = (): string => {
    return formatDateToISO(new Date());
};

// Get a readable date format: "Monday, January 15"
export const formatReadableDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const day = DAYS_OF_WEEK[date.getDay()];
    const month = MONTHS[date.getMonth()];
    return `${day}, ${month} ${date.getDate()}`;
};

// Get just the day of month (1-31)
export const getDayOfMonth = (isoDate: string): number => {
    return new Date(isoDate).getDate();
};

// Get the month name from ISO date
export const getMonthName = (isoDate: string): string => {
    const monthIndex = new Date(isoDate).getMonth();
    return MONTHS[monthIndex];
};

// Get the year from ISO date
export const getYear = (isoDate: string): number => {
    return new Date(isoDate).getFullYear();
};

// Get the day name from ISO date
export const getDayName = (isoDate: string): string => {
    const dayIndex = new Date(isoDate).getDay();
    return DAYS_OF_WEEK[dayIndex];
};

// Get the next occurrence of a day (e.g., next Monday)
export const getNextDayOccurrence = (dayName: string): string => {
    const today = new Date();
    const dayIndex = DAYS_OF_WEEK.indexOf(dayName);

    if (dayIndex === -1) return formatDateToISO(today);

    const todayDayIndex = today.getDay();
    let daysToAdd = dayIndex - todayDayIndex;

    if (daysToAdd <= 0) {
        daysToAdd += 7; // Get next week if today or already passed
    }

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);

    return formatDateToISO(targetDate);
};

// Get dates for a week given a date within that week
export const getWeekDates = (dateInWeek: string): string[] => {
    const date = new Date(dateInWeek);
    const day = date.getDay(); // 0 is Sunday, 6 is Saturday

    // Find the Sunday of this week
    const sundayDate = new Date(date);
    sundayDate.setDate(date.getDate() - day);

    // Generate the 7 days of the week
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(sundayDate);
        currentDate.setDate(sundayDate.getDate() + i);
        weekDates.push(formatDateToISO(currentDate));
    }

    return weekDates;
};

// Get dates for a month grid (includes dates from prev/next month to fill grid)
export const getMonthGrid = (year: number, month: number): string[] => {
    // Month is 0-based (0 = January, 11 = December)
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Calculate how many days we need from previous month
    const daysFromPrevMonth = startDayOfWeek;

    // Calculate how many days we need from next month
    const totalCells = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7;
    const daysFromNextMonth = totalCells - daysInMonth - daysFromPrevMonth;

    const dates: string[] = [];

    // Add days from previous month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

    for (let i = 0; i < daysFromPrevMonth; i++) {
        const day = prevMonthLastDay - daysFromPrevMonth + i + 1;
        const date = new Date(prevMonthYear, prevMonth, day);
        dates.push(formatDateToISO(date));
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        dates.push(formatDateToISO(date));
    }

    // Add days from next month
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;

    for (let i = 1; i <= daysFromNextMonth; i++) {
        const date = new Date(nextMonthYear, nextMonth, i);
        dates.push(formatDateToISO(date));
    }

    return dates;
};

// Add months to a date and return new ISO date
export const addMonths = (isoDate: string, numMonths: number): string => {
    const date = new Date(isoDate);
    date.setMonth(date.getMonth() + numMonths);
    return formatDateToISO(date);
};

// Add weeks to a date and return new ISO date
export const addWeeks = (isoDate: string, numWeeks: number): string => {
    const date = new Date(isoDate);
    date.setDate(date.getDate() + (numWeeks * 7));
    return formatDateToISO(date);
};