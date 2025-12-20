import { useMemo } from "react";
import type { OwnerBookingResponse } from "../types/booking.types";
import styles from "./BookingTimeline.module.css";

interface BookingTimelineProps {
    bookings: OwnerBookingResponse[];
    courts: Array<{ id: number; name: string; facilityId: number }>;
    onBookingClick?: (booking: OwnerBookingResponse) => void;
    onEmptySlotClick?: (courtId: number, startTime: string, endTime: string) => void;
}

const START_HOUR = 5;
const END_HOUR = 23;
const MINUTES_PER_SLOT = 30;
const SLOTS_PER_HOUR = 60 / MINUTES_PER_SLOT;
const TOTAL_COLUMNS = (END_HOUR - START_HOUR) * SLOTS_PER_HOUR;

export default function BookingTimeline({
    bookings,
    courts,
    onBookingClick,
    onEmptySlotClick
}: BookingTimelineProps) {
    // Generate time slots for header
    const timeSlots = useMemo(() => {
        const slots: string[] = [];
        for (let hour = START_HOUR; hour < END_HOUR; hour++) {
            slots.push(`${String(hour).padStart(2, '0')}:00`);
            slots.push(`${String(hour).padStart(2, '0')}:30`);
        }
        return slots;
    }, []);

    // Convert time string (HH:mm:ss or HH:mm) to column index (1-based for CSS Grid)
    const timeToColumn = (timeString: string): number => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const hourDiff = hours - START_HOUR;
        if (hourDiff < 0) return 1; // Before start hour
        if (hourDiff >= END_HOUR - START_HOUR) return TOTAL_COLUMNS; // After end hour
        
        const minuteSlot = minutes >= MINUTES_PER_SLOT ? 1 : 0;
        const column = hourDiff * SLOTS_PER_HOUR + minuteSlot + 1; // +1 for 1-based grid
        return Math.min(column, TOTAL_COLUMNS);
    };

    // Get status color
    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            PENDING: '#fbbf24',      // Yellow
            CONFIRMED: '#10b981',    // Green
            CANCELLED: '#ef4444',    // Red
            COMPLETED: '#3b82f6',    // Blue
            NO_SHOW: '#6b7280',      // Gray
            EXPIRED: '#9ca3af'       // Light Gray
        };
        return colors[status] || '#6b7280';
    };

    // Get status label
    const getStatusLabel = (status: string): string => {
        const labels: Record<string, string> = {
            PENDING: "Chờ xác nhận",
            CONFIRMED: "Đã xác nhận",
            CANCELLED: "Đã hủy",
            COMPLETED: "Hoàn thành",
            NO_SHOW: "Không đến",
            EXPIRED: "Hết hạn"
        };
        return labels[status] || status;
    };

    // Format time for display
    const formatTime = (timeString: string): string => {
        return timeString.substring(0, 5); // "HH:mm"
    };

    // Group bookings by court
    const bookingsByCourt = useMemo(() => {
        const map = new Map<number, OwnerBookingResponse[]>();
        courts.forEach(court => {
            map.set(court.id, []);
        });
        bookings.forEach(booking => {
            const courtBookings = map.get(booking.courtId) || [];
            courtBookings.push(booking);
            map.set(booking.courtId, courtBookings);
        });
        return map;
    }, [bookings, courts]);

    // Handle empty slot click
    const handleEmptySlotClick = (courtId: number, columnIndex: number) => {
        if (!onEmptySlotClick) return;
        
        const hour = Math.floor(columnIndex / SLOTS_PER_HOUR) + START_HOUR;
        const minute = (columnIndex % SLOTS_PER_HOUR) * MINUTES_PER_SLOT;
        const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
        
        // Default to 1 hour slot
        const endHour = minute === 0 ? hour + 1 : hour + 1;
        const endMinute = minute === 0 ? 0 : MINUTES_PER_SLOT;
        const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
        
        onEmptySlotClick(courtId, startTime, endTime);
    };

    return (
        <div className={styles.timelineWrapper}>
            <div className={styles.timelineContainer}>
                {/* Header Row - Time Slots */}
                <div className={styles.timelineHeader}>
                    <div className={styles.courtNameHeader}>Sân</div>
                    <div className={styles.timeSlotsHeader}>
                        {timeSlots.map((time, index) => (
                            <div key={index} className={styles.timeSlotHeader}>
                                {index % 2 === 0 && (
                                    <span className={styles.timeSlotHour}>{time.substring(0, 2)}</span>
                                )}
                                {index % 2 === 1 && (
                                    <span className={styles.timeSlotMinute}>30</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Court Rows */}
                <div className={styles.timelineBody}>
                    {courts.map(court => {
                        const courtBookings = bookingsByCourt.get(court.id) || [];
                        
                        return (
                            <div key={court.id} className={styles.courtRow}>
                                {/* Court Name (Sticky) */}
                                <div className={styles.courtNameCell}>
                                    <span className={styles.courtName}>{court.name}</span>
                                </div>

                                {/* Timeline Grid */}
                                <div className={styles.timelineGrid}>
                                    {/* Empty slots - background cells */}
                                    {Array.from({ length: TOTAL_COLUMNS }, (_, index) => {
                                        const columnIndex = index + 1;
                                        const hasBooking = courtBookings.some(booking => {
                                            const startCol = timeToColumn(booking.startTime);
                                            const endCol = timeToColumn(booking.endTime);
                                            return columnIndex >= startCol && columnIndex < endCol;
                                        });

                                        return (
                                            <div
                                                key={`empty-${index}`}
                                                className={styles.emptySlot}
                                                onClick={() => !hasBooking && handleEmptySlotClick(court.id, columnIndex)}
                                                title={hasBooking ? "" : "Click để tạo đặt sân mới"}
                                            />
                                        );
                                    })}

                                    {/* Booking Blocks - positioned absolutely within grid */}
                                    {courtBookings.map(booking => {
                                        const startCol = timeToColumn(booking.startTime);
                                        const endCol = timeToColumn(booking.endTime);

                                        return (
                                            <div
                                                key={booking.id}
                                                className={styles.bookingBlock}
                                                style={{
                                                    gridColumnStart: startCol,
                                                    gridColumnEnd: endCol,
                                                    backgroundColor: getStatusColor(booking.status)
                                                }}
                                                onClick={() => onBookingClick?.(booking)}
                                                title={`${booking.playerName} - ${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`}
                                            >
                                                <div className={styles.bookingContent}>
                                                    <div className={styles.bookingPlayerName}>
                                                        {booking.playerName}
                                                    </div>
                                                    <div className={styles.bookingTime}>
                                                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                                    </div>
                                                    <div className={styles.bookingStatus}>
                                                        {getStatusLabel(booking.status)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

