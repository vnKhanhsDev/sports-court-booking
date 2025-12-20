import { useState, useMemo, useEffect } from "react";
import styles from "./TimeSelection.module.css";

type DateOption = "today" | "tomorrow" | "custom";
type ScheduleType = "oddDays" | "fixedDays";

interface TimeSlot {
    time: string;
    price: string;
    available: boolean;
}

export interface TimeSelectionData {
    scheduleType: ScheduleType;
    dateOption: DateOption;
    customDate: string;
    selectedDaysOfWeek: number[];
    selectedStartTime: string | null;
    selectedEndTime: string | null;
    selectedDate: Date | null;
    totalPrice: number;
}

interface TimeSelectionProps {
    openingTime: string; // Format: "HH:mm:ss"
    closingTime: string; // Format: "HH:mm:ss"
    onDataChange?: (data: TimeSelectionData) => void;
}

const DAYS_OF_WEEK = [
    { value: 0, label: "Chủ nhật", short: "CN" },
    { value: 1, label: "Thứ 2", short: "T2" },
    { value: 2, label: "Thứ 3", short: "T3" },
    { value: 3, label: "Thứ 4", short: "T4" },
    { value: 4, label: "Thứ 5", short: "T5" },
    { value: 5, label: "Thứ 6", short: "T6" },
    { value: 6, label: "Thứ 7", short: "T7" },
];

export default function TimeSelection({ openingTime, closingTime, onDataChange }: TimeSelectionProps) {
    const [scheduleType, setScheduleType] = useState<ScheduleType>("oddDays");
    const [dateOption, setDateOption] = useState<DateOption>("today");
    const [customDate, setCustomDate] = useState<string>("");
    const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<number[]>([]);
    const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
    const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);

    // Parse opening and closing times
    const { openingHour, closingHour } = useMemo(() => {
        // Parse "HH:mm:ss" format to get hour
        const parseTime = (timeString: string): number => {
            const parts = timeString.split(':');
            return parseInt(parts[0], 10);
        };

        const openHour = parseTime(openingTime);
        const closeHour = parseTime(closingTime);

        return {
            openingHour: openHour,
            closingHour: closeHour
        };
    }, [openingTime, closingTime]);

    // Generate time slots from 00:00 to 23:00
    const timeSlots: TimeSlot[] = useMemo(() => {
        const slots: TimeSlot[] = [];
        const prices = [
            { start: 0, end: 6, price: "150,000₫" },   // 00:00 - 05:00
            { start: 6, end: 9, price: "200,000₫" },   // 06:00 - 08:00
            { start: 9, end: 12, price: "250,000₫" },  // 09:00 - 11:00
            { start: 12, end: 14, price: "300,000₫" }, // 12:00 - 13:00
            { start: 14, end: 17, price: "300,000₫" },  // 14:00 - 16:00
            { start: 17, end: 19, price: "350,000₫" }, // 17:00 - 18:00
            { start: 19, end: 22, price: "400,000₫" }, // 19:00 - 21:00
            { start: 22, end: 24, price: "350,000₫" }, // 22:00 - 23:00
        ];

        // Check if selected date is today
        const isToday = dateOption === "today" || 
            (dateOption === "custom" && customDate && 
             new Date(customDate).toDateString() === new Date().toDateString());
        
        // Get current time if today is selected
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        for (let hour = 0; hour < 24; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            
            // Find price for this hour
            const priceRange = prices.find(p => hour >= p.start && hour < p.end);
            const price = priceRange?.price || "200,000₫";
            
            // Check if hour is within opening/closing time
            // Handle case where closing time is next day (e.g., 22:00 to 02:00)
            let isWithinOperatingHours = false;
            
            if (openingHour <= closingHour) {
                // Normal case: opening time is before closing time (e.g., 06:00 to 22:00)
                isWithinOperatingHours = hour >= openingHour && hour < closingHour;
            } else {
                // Overnight case: closing time is next day (e.g., 22:00 to 06:00)
                isWithinOperatingHours = hour >= openingHour || hour < closingHour;
            }
            
            // Check if time slot is in the past (only for today)
            let isPastTime = false;
            if (isToday) {
                // If the hour is before current hour, it's in the past
                // If the hour equals current hour, check if we're past the hour (minutes > 0)
                if (hour < currentHour) {
                    isPastTime = true;
                } else if (hour === currentHour && currentMinute > 0) {
                    // If it's the current hour but minutes have passed, disable it
                    // (since slots are hourly, we disable the current hour if any minutes have passed)
                    isPastTime = true;
                }
            }
            
            // Slot is available only if it's within operating hours AND not in the past
            // Additional availability checks (booked, locked, etc.) would come from API
            const available = isWithinOperatingHours && !isPastTime;
            
            slots.push({
                time: timeString,
                price,
                available
            });
        }

        return slots;
    }, [openingHour, closingHour, dateOption, customDate]);

    const getDateLabel = (option: DateOption): string => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        switch (option) {
            case "today":
                return `Hôm nay (${formatDateDisplay(today)})`;
            case "tomorrow":
                return `Ngày mai (${formatDateDisplay(tomorrow)})`;
            default:
                return "Chọn ngày khác";
        }
    };

    const formatDateDisplay = (date: Date): string => {
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const getSelectedDate = (): Date => {
        const today = new Date();
        
        switch (dateOption) {
            case "today":
                return today;
            case "tomorrow":
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                return tomorrow;
            case "custom":
                if (customDate) {
                    return new Date(customDate);
                }
                return today;
            default:
                return today;
        }
    };

    const getSelectedDateDisplay = (): string => {
        if (dateOption === "custom" && customDate) {
            const date = new Date(customDate);
            return date.toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
        }
        if (dateOption !== "custom") {
            const selectedDate = getSelectedDate();
            return selectedDate.toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
        }
        return "Vui lòng chọn ngày";
    };

    const getSelectedTimeDisplay = (): string => {
        if (selectedStartTime && selectedEndTime) {
            return `${selectedStartTime} - ${selectedEndTime}`;
        } else if (selectedStartTime) {
            return `${selectedStartTime} - --:--`;
        }
        return "--:-- - --:--";
    };

    const getTotalPrice = (): string => {
        if (!selectedStartTime) return "0₫";
        
        const startSlot = timeSlots.find(s => s.time === selectedStartTime);
        if (!startSlot) return "0₫";
        
        if (!selectedEndTime) {
            // Only start time selected, show price for one hour
            return startSlot.price;
        }
        
        // Calculate total price for time range
        const startHour = parseInt(selectedStartTime.split(':')[0]);
        const endHour = parseInt(selectedEndTime.split(':')[0]);
        const hours = endHour - startHour;
        
        if (hours <= 0) return startSlot.price;
        
        // Use the start slot's price per hour and multiply by hours
        // In a real app, this would use actual pricing from the API
        const pricePerHour = parseFloat(startSlot.price.replace(/[^\d]/g, ''));
        const totalPrice = pricePerHour * hours;
        
        return `${totalPrice.toLocaleString('vi-VN')}₫`;
    };

    const getTotalPriceNumber = (): number => {
        if (!selectedStartTime) return 0;
        
        const startSlot = timeSlots.find(s => s.time === selectedStartTime);
        if (!startSlot) return 0;
        
        if (!selectedEndTime) {
            const pricePerHour = parseFloat(startSlot.price.replace(/[^\d]/g, ''));
            return pricePerHour;
        }
        
        const startHour = parseInt(selectedStartTime.split(':')[0]);
        const endHour = parseInt(selectedEndTime.split(':')[0]);
        const hours = endHour - startHour;
        
        if (hours <= 0) {
            const pricePerHour = parseFloat(startSlot.price.replace(/[^\d]/g, ''));
            return pricePerHour;
        }
        
        const pricePerHour = parseFloat(startSlot.price.replace(/[^\d]/g, ''));
        return pricePerHour * hours;
    };

    // Notify parent of data changes
    useEffect(() => {
        if (onDataChange) {
            const selectedDate = scheduleType === "oddDays" ? getSelectedDate() : null;
            onDataChange({
                scheduleType,
                dateOption,
                customDate,
                selectedDaysOfWeek,
                selectedStartTime,
                selectedEndTime,
                selectedDate,
                totalPrice: getTotalPriceNumber()
            });
        }
    }, [scheduleType, dateOption, customDate, selectedDaysOfWeek, selectedStartTime, selectedEndTime, onDataChange]);

    const handleTimeSlotClick = (time: string, available: boolean) => {
        if (!available) return;
        
        const timeHour = parseInt(time.split(':')[0]);
        
        if (!selectedStartTime) {
            // First selection - set as start time
            setSelectedStartTime(time);
            setSelectedEndTime(null);
        } else if (!selectedEndTime) {
            // Second selection - set as end time
            const startHour = parseInt(selectedStartTime.split(':')[0]);
            
            if (timeHour <= startHour) {
                // If clicked time is before or equal to start, reset and set as new start
                setSelectedStartTime(time);
                setSelectedEndTime(null);
            } else {
                // Valid end time
                setSelectedEndTime(time);
            }
        } else {
            // Both times selected - clicking will reset or set new start
            if (timeHour <= parseInt(selectedStartTime.split(':')[0])) {
                // Clicked before start - set as new start
                setSelectedStartTime(time);
                setSelectedEndTime(null);
            } else if (timeHour <= parseInt(selectedEndTime.split(':')[0])) {
                // Clicked between start and end - update end time
                setSelectedEndTime(time);
            } else {
                // Clicked after end - set as new start
                setSelectedStartTime(time);
                setSelectedEndTime(null);
            }
        }
    };

    const isTimeSlotSelected = (time: string): "start" | "end" | "range" | false => {
        if (selectedStartTime === time) return "start";
        if (selectedEndTime === time) return "end";
        
        if (selectedStartTime && selectedEndTime) {
            const timeHour = parseInt(time.split(':')[0]);
            const startHour = parseInt(selectedStartTime.split(':')[0]);
            const endHour = parseInt(selectedEndTime.split(':')[0]);
            
            if (timeHour > startHour && timeHour < endHour) {
                return "range";
            }
        }
        
        return false;
    };

    const handleDayOfWeekToggle = (dayValue: number) => {
        setSelectedDaysOfWeek(prev => {
            if (prev.includes(dayValue)) {
                return prev.filter(d => d !== dayValue);
            } else {
                return [...prev, dayValue].sort((a, b) => a - b);
            }
        });
    };

    const getSelectedDaysDisplay = (): string => {
        if (selectedDaysOfWeek.length === 0) return "Chưa chọn";
        const selectedDays = selectedDaysOfWeek
            .map(day => DAYS_OF_WEEK.find(d => d.value === day)?.short)
            .filter(Boolean)
            .join(", ");
        return selectedDays;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Chọn thời gian đặt sân</h3>
                <p className={styles.subtitle}>Vui lòng chọn ngày và khung giờ bạn muốn đặt</p>
            </div>

            {/* Schedule Type Selection */}
            <div className={styles.scheduleTypeSection}>
                <label className={styles.sectionLabel}>Loại lịch đặt</label>
                <div className={styles.scheduleTypeOptions}>
                    <button
                        className={`${styles.scheduleTypeBtn} ${scheduleType === "oddDays" ? styles.active : ""}`}
                        onClick={() => setScheduleType("oddDays")}
                    >
                        <span className={styles.scheduleTypeIcon}>📅</span>
                        <span className={styles.scheduleTypeText}>Lịch lẻ</span>
                    </button>
                    <button
                        className={`${styles.scheduleTypeBtn} ${scheduleType === "fixedDays" ? styles.active : ""}`}
                        onClick={() => setScheduleType("fixedDays")}
                    >
                        <span className={styles.scheduleTypeIcon}>🔄</span>
                        <span className={styles.scheduleTypeText}>Lịch cố định</span>
                    </button>
                </div>
            </div>

            {/* Date Selection - Odd Days */}
            {scheduleType === "oddDays" && (
            <div className={styles.dateSection}>
                <label className={styles.sectionLabel}>Chọn ngày</label>
                
                {/* Date Options - All on one line */}
                <div className={styles.dateOptionsRow}>
                    <button
                        className={`${styles.dateOptionBtn} ${dateOption === "today" ? styles.active : ""}`}
                        onClick={() => setDateOption("today")}
                    >
                        <span className={styles.dateOptionIcon}>📅</span>
                        <span className={styles.dateOptionText}>Hôm nay</span>
                    </button>
                    <button
                        className={`${styles.dateOptionBtn} ${dateOption === "tomorrow" ? styles.active : ""}`}
                        onClick={() => setDateOption("tomorrow")}
                    >
                        <span className={styles.dateOptionIcon}>📆</span>
                        <span className={styles.dateOptionText}>Ngày mai</span>
                    </button>
                    <button
                        className={`${styles.dateOptionBtn} ${dateOption === "custom" ? styles.active : ""}`}
                        onClick={() => setDateOption("custom")}
                    >
                        <span className={styles.dateOptionIcon}>🗓️</span>
                        <span className={styles.dateOptionText}>Ngày khác</span>
                    </button>
                </div>
                {dateOption === "custom" && (
                    <div className={styles.customDateInputWrapper}>
                    <input
                        type="date"
                            className={styles.customDateInput}
                        min={new Date().toISOString().split('T')[0]}
                            value={customDate}
                            onChange={(e) => setCustomDate(e.target.value)}
                        />
                    </div>
                )}

                {/* Selected Date Display */}
                <div className={styles.selectedDateDisplay}>
                    <span className={styles.selectedDateLabel}>Ngày đã chọn:</span>
                    <span className={styles.selectedDateValue}>
                        {getSelectedDateDisplay()}
                    </span>
                </div>
            </div>
            )}

            {/* Days of Week Selection - Fixed Days */}
            {scheduleType === "fixedDays" && (
                <div className={styles.dateSection}>
                    <label className={styles.sectionLabel}>Chọn thứ trong tuần</label>
                    <div className={styles.daysOfWeekGrid}>
                        {DAYS_OF_WEEK.map((day) => {
                            const isSelected = selectedDaysOfWeek.includes(day.value);
                            return (
                                <button
                                    key={day.value}
                                    className={`${styles.dayOfWeekBtn} ${isSelected ? styles.selected : ""}`}
                                    onClick={() => handleDayOfWeekToggle(day.value)}
                                >
                                    <span className={styles.dayOfWeekShort}>{day.short}</span>
                                    <span className={styles.dayOfWeekLabel}>{day.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className={styles.selectedDateDisplay}>
                        <span className={styles.selectedDateLabel}>Thứ đã chọn:</span>
                        <span className={styles.selectedDateValue}>{getSelectedDaysDisplay()}</span>
                    </div>
                </div>
            )}

            {/* Time Slots Selection */}
            <div className={styles.timeSection}>
                <label className={styles.sectionLabel}>
                    Chọn khung giờ
                    <span className={styles.operatingHours}>
                        (Giờ hoạt động: {openingTime.substring(0, 5)} - {closingTime.substring(0, 5)})
                    </span>
                </label>
                
                <div className={styles.timeSlotsGrid}>
                    {timeSlots.map((slot, index) => {
                        const selectionState = isTimeSlotSelected(slot.time);
                        return (
                            <button
                            key={index}
                                className={`${styles.timeSlot} ${slot.available ? styles.available : styles.unavailable} ${selectionState === "start" ? styles.selectedStart : ""} ${selectionState === "end" ? styles.selectedEnd : ""} ${selectionState === "range" ? styles.selectedRange : ""}`}
                                onClick={() => handleTimeSlotClick(slot.time, slot.available)}
                                disabled={!slot.available}
                                title={slot.available ? `${slot.time} - ${slot.price}` : "Không khả dụng"}
                        >
                                <span className={styles.time}>{slot.time}</span>
                                <span className={styles.price}>{slot.price}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selection Summary */}
            <div className={styles.selectedInfo}>
                <div className={styles.selectedHeader}>
                    <span className={styles.selectedHeaderIcon}>✓</span>
                    <span className={styles.selectedHeaderText}>Thông tin đã chọn</span>
                </div>
                <div className={styles.selectedDetails}>
                <div className={styles.selectedItem}>
                        <span className={styles.selectedLabel}>
                            {scheduleType === "oddDays" ? "Ngày:" : "Thứ:"}
                        </span>
                        <span className={styles.selectedValue}>
                            {scheduleType === "oddDays" 
                                ? (dateOption === "custom" && !customDate 
                                    ? "Chưa chọn" 
                                    : getSelectedDateDisplay().split(',')[0] || "--/--")
                                : getSelectedDaysDisplay()}
                        </span>
                </div>
                    <div className={styles.selectedItem}>
                        <span className={styles.selectedLabel}>Khung giờ:</span>
                        <span className={styles.selectedValue}>{getSelectedTimeDisplay()}</span>
                    </div>
                    {selectedStartTime && selectedEndTime && (
                        <div className={styles.selectedItem}>
                            <span className={styles.selectedLabel}>Số giờ:</span>
                            <span className={styles.selectedValue}>
                                {parseInt(selectedEndTime.split(':')[0]) - parseInt(selectedStartTime.split(':')[0])} giờ
                            </span>
                        </div>
                    )}
                    <div className={styles.selectedDivider}></div>
                <div className={styles.selectedItem}>
                    <span className={styles.selectedLabel}>Tổng tiền:</span>
                        <span className={styles.selectedTotal}>{getTotalPrice()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
