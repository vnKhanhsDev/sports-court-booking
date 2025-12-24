import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useApi from "@/hooks/useApi";
import { publicCourtService } from "@/features/court/services/courtService";
import type { PriceSlot } from "@/features/court/types/price.types";
import styles from "./BookingTimeSelector.module.css";

interface CourtSummary {
    courtId: number;
    courtName: string;
    courtTypeName: string;
    surfaceTypeName: string;
    imageUrls: string[];
}

interface BookingTimeSelectorProps {
    openingTime: string; // Format: "HH:mm:ss"
    closingTime: string; // Format: "HH:mm:ss"
    courts: CourtSummary[];
    facilityId: number;
    facilityName: string;
}

type DateOption = "today" | "tomorrow" | "custom";

export default function BookingTimeSelector({
    openingTime,
    closingTime,
    courts,
    facilityId,
    facilityName,
}: BookingTimeSelectorProps) {
    const [dateOption, setDateOption] = useState<DateOption>("today");
    const [customDate, setCustomDate] = useState<string>("");
    const [selectedCourt, setSelectedCourt] = useState<number | null>(null);
    const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
    const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
    const [priceSlotsByCourt, setPriceSlotsByCourt] = useState<Record<number, PriceSlot[]>>({});

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { execute, isLoading: isLoadingPrice } = useApi();

    // Parse opening and closing times
    const { openingHour, closingHour } = useMemo(() => {
        const parseTime = (timeString: string): number => {
            const parts = timeString.split(":");
            return parseInt(parts[0], 10);
        };
        return {
            openingHour: parseTime(openingTime),
            closingHour: parseTime(closingTime),
        };
    }, [openingTime, closingTime]);

    // Generate time slots
    const timeSlots = useMemo(() => {
        const slots: string[] = [];
        for (let hour = openingHour; hour < closingHour; hour++) {
            slots.push(`${hour.toString().padStart(2, "0")}:00`);
        }
        return slots;
    }, [openingHour, closingHour]);

    // Get selected date
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

    // Check if time slot is locked (past time)
    const isTimeLocked = (time: string, date: Date): boolean => {
        const now = new Date();
        const slotDate = new Date(date);
        const [hours] = time.split(":").map(Number);
        slotDate.setHours(hours, 0, 0, 0);

        // If it's today and the time has passed
        if (slotDate.toDateString() === now.toDateString() && slotDate < now) {
            return true;
        }
        // If the date is in the past
        if (slotDate < now && slotDate.toDateString() !== now.toDateString()) {
            return true;
        }
        return false;
    };

    /**
     * Get time slot status for a specific court, time and date.
     *
     * NOTE:
     * - Currently we only lock past time slots (based on the selected date)
     * - All future time slots are treated as "available"
     * - Once backend availability is implemented, this function should be
     *   extended to also mark booked slots based on API data.
     */
    const getTimeSlotStatus = (_courtId: number, time: string, date: Date): "available" | "booked" | "locked" => {
        if (isTimeLocked(time, date)) return "locked";
        return "available";
    };

    // Check if time slot is selected
    const isTimeSlotSelected = (time: string): "start" | "end" | "range" | false => {
        if (!selectedStartTime || selectedCourt === null) return false;
        if (selectedStartTime === time) return "start";
        if (selectedEndTime === time) return "end";

        if (selectedStartTime && selectedEndTime) {
            const timeHour = parseInt(time.split(":")[0]);
            const startHour = parseInt(selectedStartTime.split(":")[0]);
            const endHour = parseInt(selectedEndTime.split(":")[0]);

            if (timeHour > startHour && timeHour < endHour) {
                return "range";
            }
        }
        return false;
    };

    // Handle time slot click
    const handleTimeSlotClick = (courtId: number, time: string, date: Date) => {
        const status = getTimeSlotStatus(courtId, time, date);
        if (status !== "available") return;

        // If different court selected, reset
        if (selectedCourt !== courtId) {
            setSelectedCourt(courtId);
            setSelectedStartTime(time);
            setSelectedEndTime(null);
            return;
        }

        const timeHour = parseInt(time.split(":")[0]);

        if (!selectedStartTime) {
            setSelectedStartTime(time);
            setSelectedEndTime(null);
        } else if (!selectedEndTime) {
            const startHour = parseInt(selectedStartTime.split(":")[0]);
            if (timeHour <= startHour) {
                setSelectedStartTime(time);
                setSelectedEndTime(null);
            } else {
                setSelectedEndTime(time);
            }
        } else {
            const startHour = parseInt(selectedStartTime.split(":")[0]);
            const endHour = parseInt(selectedEndTime.split(":")[0]);

            if (timeHour <= startHour) {
                setSelectedStartTime(time);
                setSelectedEndTime(null);
            } else if (timeHour <= endHour) {
                setSelectedEndTime(time);
            } else {
                setSelectedStartTime(time);
                setSelectedEndTime(null);
            }
        }
    };


    // Fetch price slots for selected court
    useEffect(() => {
        const fetchPriceSlots = async () => {
            if (!selectedCourt || priceSlotsByCourt[selectedCourt]) return;
            const slots = await execute(async () => {
                return await publicCourtService.getPublicCourtPrice(selectedCourt);
            });
            if (slots) {
                setPriceSlotsByCourt((prev) => ({ ...prev, [selectedCourt]: slots }));
            }
        };
        fetchPriceSlots();
    }, [selectedCourt, execute, priceSlotsByCourt]);

    const toMinutes = (timeString: string): number => {
        const [h, m] = timeString.split(":").map(Number);
        return h * 60 + (m || 0);
    };

    const getPriceForTime = (time: string): number => {
        if (!selectedCourt) return 0;
        const slots = priceSlotsByCourt[selectedCourt];
        if (!slots || slots.length === 0) return 0;

        const minutes = toMinutes(time);
        const match = slots.find((slot) => {
            const from = toMinutes(slot.fromTime);
            const to = toMinutes(slot.toTime);
            return minutes >= from && minutes < to;
        });

        return match ? Number(match.price) : 0;
    };

    // Calculate total price using fetched price slots
    const calculateTotalPrice = (): number => {
        if (!selectedStartTime || !selectedEndTime || !selectedCourt) return 0;
        const startHour = parseInt(selectedStartTime.split(":")[0], 10);
        const endHour = parseInt(selectedEndTime.split(":")[0], 10);
        const hours = endHour - startHour;
        if (hours <= 0) return 0;

        let total = 0;
        for (let hour = startHour; hour < endHour; hour++) {
            const timeLabel = `${hour.toString().padStart(2, "0")}:00`;
            total += getPriceForTime(timeLabel);
        }
        return total;
    };

    // Get selected times display
    const getSelectedTimesDisplay = (): string => {
        if (!selectedStartTime) return "Chưa chọn thời gian";
        if (!selectedEndTime) return `${selectedStartTime} - --:--`;
        return `${selectedStartTime} - ${selectedEndTime}`;
    };

    // Format date display
    const formatDateDisplay = (date: Date): string => {
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Get selected date display
    const getSelectedDateDisplay = (): string => {
        if (dateOption === "custom" && !customDate) return "Chưa chọn ngày";
        return formatDateDisplay(getSelectedDate());
    };

    const totalPrice = calculateTotalPrice();

    const handleCheckout = () => {
        if (!selectedCourt || !selectedStartTime || !selectedEndTime) return;

        const court = courts.find((c) => c.courtId === selectedCourt);
        const bookingDate = getSelectedDate().toISOString().split("T")[0];

        navigate("/courts/checkout", {
            state: {
                facilityId,
                facilityName,
                courtId: selectedCourt,
                courtName: court?.courtName,
                bookingDate,
                startTime: `${selectedStartTime}:00`,
                endTime: `${selectedEndTime}:00`,
                totalPrice,
            },
        });
    };

    return (
        <div className={styles.container}>
            {/* Left Side - Time Selection */}
            <div className={styles.timeSelection}>
                <div className={styles.timeSelectionHeader}>
                    <h3 className={styles.timeSelectionTitle}>Chọn thời gian</h3>
                    <p className={styles.timeSelectionSubtitle}>
                        Giờ hoạt động: {openingTime.substring(0, 5)} - {closingTime.substring(0, 5)}
                    </p>
                </div>

                {/* Date Selection */}
                <div className={styles.dateSection}>
                        <label className={styles.sectionLabel}>Chọn ngày</label>
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
                                    min={new Date().toISOString().split("T")[0]}
                                    value={customDate}
                                    onChange={(e) => setCustomDate(e.target.value)}
                                />
                            </div>
                        )}
                        <div className={styles.selectedDateDisplay}>
                            <span className={styles.selectedDateLabel}>Ngày đã chọn:</span>
                            <span className={styles.selectedDateValue}>{getSelectedDateDisplay()}</span>
                        </div>
                    </div>

                {/* Courts Selection */}
                <div className={styles.courtsSection}>
                    <label className={styles.sectionLabel}>Chọn sân</label>
                    <div className={styles.courtsScrollContainer}>
                        <div className={styles.courtsGrid}>
                            {courts.map((court) => (
                                <div
                                    key={court.courtId}
                                    className={`${styles.courtCard} ${selectedCourt === court.courtId ? styles.selected : ""}`}
                                    onClick={() => {
                                        setSelectedCourt(court.courtId);
                                        setSelectedStartTime(null);
                                        setSelectedEndTime(null);
                                    }}
                                >
                                    <div className={styles.courtCardName}>{court.courtName}</div>
                                    <div className={styles.courtCardDescription}>
                                        {court.courtTypeName} - {court.surfaceTypeName}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Time Slots Selection - Only show when court is selected */}
                {selectedCourt && (
                    <div className={styles.timeSection}>
                        <label className={styles.sectionLabel}>
                            Chọn khung giờ
                            <span className={styles.operatingHours}>
                                (Giờ hoạt động: {openingTime.substring(0, 5)} - {closingTime.substring(0, 5)})
                            </span>
                        </label>

                        <div className={styles.timeSlotsGrid}>
                            {timeSlots.map((time, index) => {
                                const selectedDate = getSelectedDate();
                                const checkDate = selectedDate;

                                const status = getTimeSlotStatus(selectedCourt, time, checkDate);

                                const selectionState = isTimeSlotSelected(time);
                                const isLocked = status === "locked";
                                const isBooked = status === "booked";
                                const isAvailable = status === "available";

                                const price = getPriceForTime(time);
                                const priceLabel = price > 0 ? `${price.toLocaleString("vi-VN")}₫` : "--";

                                return (
                                    <button
                                        key={index}
                                        className={`${styles.timeSlot} ${isAvailable ? styles.available : ""} ${
                                            isBooked ? styles.booked : ""
                                        } ${isLocked ? styles.locked : ""} ${
                                            selectionState === "start" ? styles.selectedStart : ""
                                        } ${selectionState === "end" ? styles.selectedEnd : ""} ${
                                            selectionState === "range" ? styles.selectedRange : ""
                                        }`}
                                        onClick={() =>
                                            isAvailable && handleTimeSlotClick(selectedCourt, time, checkDate)
                                        }
                                        disabled={!isAvailable}
                                        title={
                                            isAvailable
                                                ? `${time} - ${priceLabel}`
                                                : isBooked
                                                ? "Đã đặt"
                                                : "Đã khóa"
                                        }
                                    >
                                        <span className={styles.time}>{time}</span>
                                        {isAvailable && (
                                            <span className={styles.price}>
                                                {price > 0 ? priceLabel : isLoadingPrice ? "Đang tải..." : "--"}
                                            </span>
                                        )}
                                        {isBooked && <span className={styles.statusIcon}>✕</span>}
                                        {isLocked && <span className={styles.statusIcon}>🔒</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Legend */}
                {selectedCourt && (
                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendColor} ${styles.available}`}></div>
                            <span>Giờ trống</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendColor} ${styles.booked}`}></div>
                            <span>Đã đặt</span>
                        </div>
                        <div className={styles.legendItem}>
                            <div className={`${styles.legendColor} ${styles.locked}`}></div>
                            <span>Đã khóa</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side - Selected Times & Book Button */}
            <div className={styles.bookingSummary}>
                <div className={styles.bookingSummaryHeader}>
                    <h3 className={styles.bookingSummaryTitle}>Thông tin đặt sân</h3>
                </div>

                <div className={styles.selectedTimes}>
                    <div className={styles.selectedTimesHeader}>
                        <span className={styles.selectedTimesLabel}>Thời gian đã chọn:</span>
                    </div>
                    <div className={styles.selectedTimesList}>
                        {selectedStartTime && selectedCourt ? (
                            <div className={styles.selectedTimeItem}>
                                <div className={styles.selectedTimeCourt}>
                                    {courts.find((c) => c.courtId === selectedCourt)?.courtName}
                                </div>
                                <div className={styles.selectedTimeText}>{getSelectedTimesDisplay()}</div>
                                <div className={styles.selectedTimeDate}>{getSelectedDateDisplay()}</div>
                            </div>
                        ) : (
                            <div className={styles.selectedTimeItem}>
                                <span className={styles.selectedTimeText}>Chưa chọn thời gian</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.bookingSummaryFooter}>
                    <div className={styles.totalPrice}>
                        <span className={styles.totalPriceLabel}>Tổng tiền:</span>
                        <span className={styles.totalPriceValue}>{totalPrice.toLocaleString("vi-VN")}₫</span>
                    </div>
                    <button
                        className={styles.bookButton}
                        type="button"
                        disabled={!selectedStartTime || !selectedEndTime || !selectedCourt}
                        onClick={handleCheckout}
                    >
                        Đặt sân ngay
                    </button>
                </div>
            </div>
        </div>
    );
}


