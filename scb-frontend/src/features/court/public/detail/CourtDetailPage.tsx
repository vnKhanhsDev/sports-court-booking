import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useCourtDetail from "./useCourtDetail";
import Badge from "@/components/ui/badge/Badge";
import { LeftArrow } from "@/components/ui/icons";
import styles from "./CourtDetailPage.module.css";

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

export default function CourtDetailPage() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const dateString = formatDateForApi(selectedDate);
    const { courtDetail, isLoading, error, refetch } = useCourtDetail(dateString);
    
    const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        refetch(formatDateForApi(date));
    };

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


    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <p>Đang tải thông tin sân...</p>
                </div>
            </div>
        );
    }

    if (error || !courtDetail) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>{error || "Không tìm thấy thông tin sân"}</p>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    const sortedImages = courtDetail ? [...courtDetail.images].sort((a, b) => a.displayOrder - b.displayOrder) : [];
    const primaryImage = sortedImages[0]?.imageUrl || null;

    return (
        <div className={styles.container}>
            {/* Back Button */}
            <button className={styles.backButton} onClick={() => navigate(-1)}>
                <LeftArrow />
                <span>Quay lại</span>
            </button>

            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.courtName}>{courtDetail.name}</h1>
                    <p className={styles.facilityName}>{courtDetail.facilityName}</p>
                    <p className={styles.address}>{courtDetail.facilityAddress}</p>
                </div>
                <div className={styles.headerRight}>
                    <Badge label="Đã xác minh" variant="success" />
                    <div className={styles.rating}>
                        <span>Đánh giá: 4/5</span>
                        <span className={styles.reviewCount}>(1 Đánh giá)</span>
                    </div>
                    <div className={styles.actionIcons}>
                        <button className={styles.iconButton} aria-label="Chia sẻ">📤</button>
                        <button className={styles.iconButton} aria-label="Yêu thích">❤️</button>
                        <button className={styles.iconButton} aria-label="Báo cáo">⚠️</button>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                {/* Left Column: Images and Schedule */}
                <div className={styles.leftColumn}>
                    {/* Image Gallery */}
                    <div className={styles.imageSection}>
                        <div className={styles.mainImage}>
                            {primaryImage ? (
                                <img src={primaryImage} alt={courtDetail.name} />
                            ) : (
                                <div className={styles.imagePlaceholder}>Không có hình ảnh</div>
                            )}
                        </div>
                        {sortedImages.length > 1 && (
                            <div className={styles.thumbnailImages}>
                                {sortedImages.slice(1, 3).map((image, index) => (
                                    <div key={index} className={styles.thumbnail}>
                                        <img src={image.imageUrl} alt={`${courtDetail.name} ${index + 2}`} />
                                    </div>
                                ))}
                                {sortedImages.length > 3 && (
                                    <div className={styles.viewMore}>
                                        <span>Xem {sortedImages.length - 3} ảnh</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Booking Schedule */}
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
                            <button className={styles.filterButton}>Hôm nay</button>
                            <button className={styles.filterButton}>Ca sáng</button>
                            <button className={`${styles.filterButton} ${styles.active}`}>Ca chiều</button>
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
                                    {courtDetail.timeSlotAvailabilities.map((slot, index) => {
                                        const isClickable = slot.status === "AVAILABLE";
                                        
                                        return (
                                            <button
                                                key={index}
                                                className={`${styles.timeSlot} ${styles[slot.status.toLowerCase()]}`}
                                                disabled={!isClickable}
                                                title={`${formatTime(slot.fromTime)} - ${formatTime(slot.toTime)}: ${slot.price.toLocaleString('vi-VN')}₫`}
                                            >
                                                {formatTime(slot.fromTime)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Info and Booking Form */}
                <div className={styles.rightColumn}>
                    {/* Court Information Panel */}
                    <div className={styles.infoPanel}>
                        <h3 className={styles.panelTitle}>| Thông tin sân</h3>
                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Giờ mở cửa:</span>
                                <span className={styles.infoValue}>
                                    {formatTime(courtDetail.facilityOpeningTime)} - {formatTime(courtDetail.facilityClosingTime)}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Số sân thi đấu:</span>
                                <span className={styles.infoValue}>{courtDetail.facilityTotalCourts} Sân</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Giá sân:</span>
                                <span className={styles.infoValue}>Liên hệ</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Giá sân giờ vàng:</span>
                                <span className={styles.infoValue}>Liên hệ</span>
                            </div>
                        </div>
                    </div>

                    {/* Amenities Panel */}
                    <div className={styles.infoPanel}>
                        <h3 className={styles.panelTitle}>| Dịch vụ tiện ích</h3>
                        <div className={styles.amenitiesGrid}>
                            <div className={styles.amenityItem}>📶 Wifi</div>
                            <div className={styles.amenityItem}>🚗 Bãi đỗ xe oto</div>
                            <div className={styles.amenityItem}>🏍️ Bãi đỗ xe máy</div>
                            <div className={styles.amenityItem}>🍽️ Căng tin</div>
                            <div className={styles.amenityItem}>🧊 Trà đá</div>
                            <div className={styles.amenityItem}>🍔 Đồ ăn</div>
                            <div className={styles.amenityItem}>🥤 Nước uống</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
