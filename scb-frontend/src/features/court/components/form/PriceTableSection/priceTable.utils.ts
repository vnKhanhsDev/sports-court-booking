export interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    price: string;
}

export interface SlotError {
    invalidTimeRange: boolean;
    overlaps: boolean;
}

export const formatTime = (hour: number): string => `${hour.toString().padStart(2, "0")}:00`;

// Normalize backend time strings (e.g., "05:00:00" -> "05:00")
export const normalizeTimeString = (time?: string | null): string => {
    if (!time) return "";
    const trimmed = time.trim();
    // Expecting HH:mm or HH:mm:ss; take first 5 chars when possible
    if (trimmed.length >= 5) {
        return trimmed.slice(0, 5);
    }
    return trimmed;
};

export const parseTimeToHour = (timeString: string): number => {
    if (!timeString) return 0;
    const [hours] = timeString.split(":");
    return parseInt(hours, 10);
};

export const generateTimeOptions = (minTime: number, maxTime: number): string[] => {
    const options: string[] = [];
    for (let hour = minTime; hour <= maxTime; hour++) {
        options.push(formatTime(hour));
    }
    return options;
};

export const doIntervalsOverlap = (
    start1: number,
    end1: number,
    start2: number,
    end2: number
): boolean => start1 < end2 && start2 < end1;

export const validateSlots = (slots: TimeSlot[]): Map<string, SlotError> => {
    const errors = new Map<string, SlotError>();

    slots.forEach((slot, index) => {
        const startHour = parseTimeToHour(slot.startTime);
        const endHour = parseTimeToHour(slot.endTime);

        const slotError: SlotError = {
            invalidTimeRange: endHour <= startHour,
            overlaps: false,
        };

        for (let i = 0; i < slots.length; i++) {
            if (i === index) continue;

            const otherStart = parseTimeToHour(slots[i].startTime);
            const otherEnd = parseTimeToHour(slots[i].endTime);

            if (doIntervalsOverlap(startHour, endHour, otherStart, otherEnd)) {
                slotError.overlaps = true;
                break;
            }
        }

        if (slotError.invalidTimeRange || slotError.overlaps) {
            errors.set(slot.id, slotError);
        }
    });

    return errors;
};
