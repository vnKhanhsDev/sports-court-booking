import { useState, useMemo, Fragment, useEffect } from "react";
import { Delete } from "@/components/ui/icons";
import styles from "./PriceTable.module.css";

export interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    price: string;
}

interface SlotError {
    invalidTimeRange: boolean;
    overlaps: boolean;
}

interface PriceTableProps {
    minTime: number;
    maxTime: number;
    initialSlots?: Array<{ startTime: string; endTime: string; price: number }>;
    onChange?: (slots: TimeSlot[]) => void;
}

function formatTime(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
}

function parseTimeToHour(timeString: string): number {
    if (!timeString) return 0;
    const [hours] = timeString.split(':');
    return parseInt(hours, 10);
}

function generateTimeOptions(minTime: number, maxTime: number): string[] {
    const options: string[] = [];
    for (let hour = minTime; hour <= maxTime; hour++) {
        options.push(formatTime(hour));
    }
    return options;
}

function doIntervalsOverlap(
    start1: number,
    end1: number,
    start2: number,
    end2: number
): boolean {
    // Two intervals overlap if one starts before the other ends
    return start1 < end2 && start2 < end1;
}

function validateSlots(slots: TimeSlot[]): Map<string, SlotError> {
    const errors = new Map<string, SlotError>();
    
    slots.forEach((slot, index) => {
        const startHour = parseTimeToHour(slot.startTime);
        const endHour = parseTimeToHour(slot.endTime);
        
        const slotError: SlotError = {
            invalidTimeRange: endHour <= startHour,
            overlaps: false,
        };
        
        // Check for overlaps with other slots
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
}

export default function PriceTable({
    minTime,
    maxTime,
    initialSlots,
    onChange,
}: PriceTableProps) {
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

    const timeOptions = generateTimeOptions(minTime, maxTime);
    
    // Load initial slots when provided
    useEffect(() => {
        if (initialSlots && initialSlots.length > 0) {
            const slots: TimeSlot[] = initialSlots.map((slot, index) => ({
                id: `initial-${index}-${Date.now()}`,
                startTime: slot.startTime,
                endTime: slot.endTime,
                price: slot.price.toString(),
            }));
            setTimeSlots(slots);
        } else if (initialSlots && initialSlots.length === 0) {
            // Explicitly empty array means clear the slots
            setTimeSlots([]);
        }
    }, [initialSlots]);

    // Notify parent of changes
    useEffect(() => {
        if (onChange) {
            onChange(timeSlots);
        }
    }, [timeSlots, onChange]);
    
    // Validate slots and get errors
    const slotErrors = useMemo(() => validateSlots(timeSlots), [timeSlots]);

    const handleAddSlot = () => {
        let newStartTime: number;
        
        if (timeSlots.length > 0) {
            // Get the end time of the last slot
            const lastSlot = timeSlots[timeSlots.length - 1];
            newStartTime = parseTimeToHour(lastSlot.endTime);
        } else {
            // If no slots exist, start from minTime
            newStartTime = minTime;
        }
        
        // Ensure start time doesn't exceed maxTime
        if (newStartTime >= maxTime) {
            return; // Cannot add more slots
        }
        
        // End time is one hour after start, but not exceeding maxTime
        const newEndTime = Math.min(newStartTime + 1, maxTime);
        
        const newSlot: TimeSlot = {
            id: `new-${Date.now()}`,
            startTime: formatTime(newStartTime),
            endTime: formatTime(newEndTime),
            price: '',
        };
        setTimeSlots([...timeSlots, newSlot]);
    };

    const handleDelete = (id: string) => {
        setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    };

    const handleUpdateSlot = (id: string, field: keyof TimeSlot, value: string) => {
        setTimeSlots(timeSlots.map(slot =>
            slot.id === id ? { ...slot, [field]: value } : slot
        ));
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.headerCell}>Bắt đầu</th>
                        <th className={styles.headerCell}>Kết thúc</th>
                        <th className={styles.headerCell}>Giá</th>
                        <th className={styles.headerCell}></th>
                    </tr>
                </thead>
                <tbody>
                    {timeSlots.map((slot) => {
                        const error = slotErrors.get(slot.id);
                        const hasError = error !== undefined;
                        
                        return (
                            <Fragment key={slot.id}>
                                <tr className={`${styles.row} ${hasError ? styles.rowError : ''}`}>
                                    <td className={styles.cell}>
                                        <div className={styles.inputWrapper}>
                                            <select
                                                className={`${styles.select} ${error?.invalidTimeRange || error?.overlaps ? styles.selectError : ''}`}
                                                value={slot.startTime}
                                                onChange={(e) => handleUpdateSlot(slot.id, 'startTime', e.target.value)}
                                            >
                                                {timeOptions.map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className={styles.cell}>
                                        <div className={styles.inputWrapper}>
                                            <select
                                                className={`${styles.select} ${error?.invalidTimeRange || error?.overlaps ? styles.selectError : ''}`}
                                                value={slot.endTime}
                                                onChange={(e) => handleUpdateSlot(slot.id, 'endTime', e.target.value)}
                                            >
                                                {timeOptions.map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className={styles.cell}>
                                        <div className={styles.inputWrapper}>
                                            <input
                                                type="text"
                                                className={styles.priceInput}
                                                value={slot.price}
                                                onChange={(e) => handleUpdateSlot(slot.id, 'price', e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                    </td>
                                    <td className={styles.cell}>
                                        <button
                                            type="button"
                                            className={styles.deleteButton}
                                            onClick={() => handleDelete(slot.id)}
                                            aria-label="Xóa khung giờ"
                                        >
                                            <Delete />
                                        </button>
                                    </td>
                                </tr>
                                {hasError && (
                                    <tr className={styles.errorRow}>
                                        <td colSpan={4} className={styles.errorCell}>
                                            {error.invalidTimeRange && (
                                                <span className={styles.errorMessage}>
                                                    Thời gian kết thúc phải lớn hơn thời gian bắt đầu
                                                </span>
                                            )}
                                            {error.overlaps && (
                                                <span className={styles.errorMessage}>
                                                    Khung giờ này trùng với khung giờ khác
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        );
                    })}
                    <tr>
                        <td colSpan={4} className={styles.addButtonCell}>
                            <button
                                type="button"
                                className={styles.addButton}
                                onClick={handleAddSlot}
                            >
                                + Thêm khung giờ
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
