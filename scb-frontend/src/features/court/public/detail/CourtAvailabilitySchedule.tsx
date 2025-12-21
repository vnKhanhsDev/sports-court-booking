import { useState, useMemo, useCallback } from "react";
import type { TimeSlotAvailability } from "@/features/court/types/court.types";
import { publicCourtService } from "@/features/court/services/courtService";
import useApi from "@/hooks/useApi";
import styles from "./CourtAvailabilitySchedule.module.css";

interface CourtAvailabilityScheduleProps {
    courtId: number;
    initialDate?: Date;
    initialTimeSlotAvailabilities?: TimeSlotAvailability[];
}

function formatTime(timeString: string): string {
    if (!timeString) return "";
    return timeString.substring(0, 5);
}

function formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function getDayName(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[date.getDay()];
}

function getWeekDates(centerDate: Date): Date[] {
    const dates: Date[] = [];
    const startOfWeek = new Date(centerDate);
    // Get Monday of the week (day 1 in JavaScript, but we want Monday = 0)
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
    }
    return dates;
}

function formatDateForApi(date: Date): string {
    return date.toISOString().split('T')[0];
}

export default function CourtAvailabilitySchedule({
    courtId,
    initialDate = new Date(),
    initialTimeSlotAvailabilities = []
}: CourtAvailabilityScheduleProps) {
    const { execute, isLoading } = useApi();
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
    const [timeSlotAvailabilities, setTimeSlotAvailabilities] = useState<TimeSlotAvailability[]>(initialTimeSlotAvailabilities);
    const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>("afternoon");

    const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
    const dateString = formatDateForApi(selectedDate);

    const fetchAvailability = useCallback(async (date: Date) => {
        const dateStr = formatDateForApi(date);
        const result = await execute(async () => {
            const detail = await publicCourtService.getPublicCourtDetail(courtId, dateStr);
            return detail.timeSlotAvailabilities;
        });

        if (result && Array.isArray(result)) {
            setTimeSlotAvailabilities(result);
        }
    }, [courtId, execute]);

    const handleDateChange = useCallback((date: Date) => {
        setSelectedDate(date);
        fetchAvailability(date);
    }, [fetchAvailability]);

    const handlePrevWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 7);
        handleDateChange(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 7);
        handleDateChange(newDate);
    };

    const handleTodayClick = () => {
        handleDateChange(new Date());
    };

    // Filter time slots based on selected time period
    const filteredTimeSlots = useMemo(() => {
        if (selectedTimeFilter === "today") {
            const today = new Date();
            const todayStr = formatDateForApi(today);
            if (dateString === todayStr) {
                return timeSlotAvailabilities;
            }
            return [];
        }
        
        if (selectedTimeFilter === "morning") {
            return timeSlotAvailabilities.filter(slot => {
                const hour = parseInt(slot.fromTime.substring(0, 2));
                return hour < 12;
            });
        }
        
        if (selectedTimeFilter === "afternoon") {
            return timeSlotAvailabilities.filter(slot => {
                const hour = parseInt(slot.fromTime.substring(0, 2));
                return hour >= 12;
            });
        }
        
        return timeSlotAvailabilities;
    }, [timeSlotAvailabilities, selectedTimeFilter, dateString]);

    return (
        <div className={styles.scheduleSection}>
            <div className={styles.scheduleHeader}>
                <button className={styles.navButton} onClick={handlePrevWeek}>‹</button>
                <span className={styles.weekRange}>
                    {formatDate(formatDateForApi(weekDates[0]))} - {formatDate(formatDateForApi(weekDates[6]))}
                </span>
                <button className={styles.navButton} onClick={handleNextWeek}>›</button>
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.available}`}></div>
                    <span>Giờ trống</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.locked}`}></div>
                    <span>Đã khóa</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.booked}`}></div>
                    <span>Đã đặt</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles.played}`}></div>
                    <span>Đã chơi</span>
                </div>
            </div>

            <div className={styles.timeFilters}>
                <button 
                    className={`${styles.filterButton} ${selectedTimeFilter === "today" ? styles.active : ""}`}
                    onClick={() => {
                        setSelectedTimeFilter("today");
                        handleTodayClick();
                    }}
                >
                    Hôm nay
                </button>
                <button 
                    className={`${styles.filterButton} ${selectedTimeFilter === "morning" ? styles.active : ""}`}
                    onClick={() => setSelectedTimeFilter("morning")}
                >
                    Ca sáng
                </button>
                <button 
                    className={`${styles.filterButton} ${selectedTimeFilter === "afternoon" ? styles.active : ""}`}
                    onClick={() => setSelectedTimeFilter("afternoon")}
                >
                    Ca chiều
                </button>
            </div>

            <div className={styles.dayTabs}>
                {weekDates.map((date, index) => {
                    const dateStr = formatDateForApi(date);
                    const isSelected = dateStr === dateString;
                    return (
                        <button
                            key={index}
                            className={`${styles.dayTab} ${isSelected ? styles.active : ""}`}
                            onClick={() => handleDateChange(date)}
                        >
                            <span className={styles.dayName}>{getDayName(dateStr)}</span>
                            <span className={styles.dayDate}>{formatDate(dateStr).split('/')[0]}</span>
                        </button>
                    );
                })}
            </div>

            <div className={styles.timeSlots}>
                <div className={styles.courtRow}>
                    <div className={styles.courtLabel}>
                        <span>⚽</span>
                        <span>01</span>
                    </div>
                    <div className={styles.slotsGrid}>
                        {isLoading ? (
                            <div className={styles.loadingSlots}>Đang tải...</div>
                        ) : filteredTimeSlots.length === 0 ? (
                            <div className={styles.emptySlots}>Không có khung giờ</div>
                        ) : (
                            filteredTimeSlots.map((slot, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`${styles.timeSlot} ${styles[slot.status.toLowerCase()]}`}
                                        title={`${formatTime(slot.fromTime)} - ${formatTime(slot.toTime)}: ${slot.price.toLocaleString('vi-VN')}₫`}
                                    >
                                        {formatTime(slot.fromTime)}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
