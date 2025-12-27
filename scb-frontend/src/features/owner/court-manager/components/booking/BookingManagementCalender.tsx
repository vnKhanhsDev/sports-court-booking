import { useState, useMemo } from "react";
import type { OwnerBookingResponse } from "../../types/booking.type";
import styles from "./BookingManagementCalender.module.css";

interface BookingManagementCalendarProps {
    bookings: OwnerBookingResponse[];
    onBookingClick?: (booking: OwnerBookingResponse) => void;
}

export default function BookingManagementCalender({ bookings, onBookingClick }: BookingManagementCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Get first day of month and number of days
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
        
        // Adjust to Monday = 0 (Vietnamese calendar)
        const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
        
        // Group bookings by date
        const bookingsByDate = new Map<string, OwnerBookingResponse[]>();
        bookings.forEach(booking => {
            const bookingDate = new Date(booking.bookingDate);
            const dateKey = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}-${String(bookingDate.getDate()).padStart(2, '0')}`;
            
            if (!bookingsByDate.has(dateKey)) {
                bookingsByDate.set(dateKey, []);
            }
            bookingsByDate.get(dateKey)!.push(booking);
        });
        
        // Create calendar days
        const days: Array<{ date: number; isCurrentMonth: boolean; bookings: OwnerBookingResponse[] }> = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < adjustedStartingDay; i++) {
            days.push({ date: 0, isCurrentMonth: false, bookings: [] });
        }
        
        // Add days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayBookings = bookingsByDate.get(dateKey) || [];
            days.push({ date: day, isCurrentMonth: true, bookings: dayBookings });
        }
        
        return {
            year,
            month,
            days,
            monthName: currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
        };
    }, [currentDate, bookings]);

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const formatTime = (timeString: string): string => {
        return timeString.substring(0, 5); // "HH:mm"
    };

    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            PENDING: '#fbbf24',
            CONFIRMED: '#10b981',
            CANCELLED: '#ef4444',
            COMPLETED: '#3b82f6',
            NO_SHOW: '#6b7280',
            EXPIRED: '#9ca3af'
        };
        return colors[status] || '#6b7280';
    };

    const isToday = (date: number): boolean => {
        if (!calendarData.days.find(d => d.date === date && d.isCurrentMonth)) return false;
        const today = new Date();
        return (
            today.getDate() === date &&
            today.getMonth() === calendarData.month &&
            today.getFullYear() === calendarData.year
        );
    };

    const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    return (
        <div className={styles.calendar}>
            {/* Calendar Header */}
            <div className={styles.calendarHeader}>
                <button
                    className={styles.navButton}
                    onClick={() => navigateMonth('prev')}
                    aria-label="Tháng trước"
                >
                    ‹
                </button>
                <div className={styles.monthYear}>
                    <h2 className={styles.monthTitle}>{calendarData.monthName}</h2>
                    <button className={styles.todayButton} onClick={goToToday}>
                        Hôm nay
                    </button>
                </div>
                <button
                    className={styles.navButton}
                    onClick={() => navigateMonth('next')}
                    aria-label="Tháng sau"
                >
                    ›
                </button>
            </div>

            {/* Calendar Grid */}
            <div className={styles.calendarGrid}>
                {/* Week day headers */}
                {weekDays.map((day, index) => (
                    <div key={index} className={styles.weekDayHeader}>
                        {day}
                    </div>
                ))}

                {/* Calendar days */}
                {calendarData.days.map((dayData, index) => {
                    if (!dayData.isCurrentMonth) {
                        return <div key={index} className={styles.dayCellEmpty} />;
                    }

                    const hasBookings = dayData.bookings.length > 0;
                    const todayClass = isToday(dayData.date) ? styles.today : '';

                    return (
                        <div
                            key={index}
                            className={`${styles.dayCell} ${todayClass} ${hasBookings ? styles.dayCellWithBookings : ''}`}
                        >
                            <div className={styles.dayNumber}>{dayData.date}</div>
                            {hasBookings && (
                                <div className={styles.bookingsContainer}>
                                    {dayData.bookings.slice(0, 3).map((booking) => (
                                        <div
                                            key={booking.id}
                                            className={styles.bookingDot}
                                            style={{ backgroundColor: getStatusColor(booking.status) }}
                                            title={`${booking.courtName} - ${formatTime(booking.startTime)}-${formatTime(booking.endTime)}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onBookingClick) {
                                                    onBookingClick(booking);
                                                }
                                            }}
                                        />
                                    ))}
                                    {dayData.bookings.length > 3 && (
                                        <div className={styles.moreBookings}>
                                            +{dayData.bookings.length - 3}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <div className={styles.legendTitle}>Chú thích:</div>
                <div className={styles.legendItems}>
                    <div className={styles.legendItem}>
                        <div className={styles.legendDot} style={{ backgroundColor: '#fbbf24' }} />
                        <span>Chờ xác nhận</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendDot} style={{ backgroundColor: '#10b981' }} />
                        <span>Đã xác nhận</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendDot} style={{ backgroundColor: '#3b82f6' }} />
                        <span>Hoàn thành</span>
                    </div>
                    <div className={styles.legendItem}>
                        <div className={styles.legendDot} style={{ backgroundColor: '#ef4444' }} />
                        <span>Đã hủy</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


