import { useNavigate, Link } from "react-router-dom";
import { generatePath } from "react-router-dom";
import useCourtDetail from "./useCourtDetail";
import CourtAvailabilitySchedule from "./CourtAvailabilitySchedule";
import Badge from "@/components/ui/badge/Badge";
import { LeftArrow } from "@/components/ui/icons";
import { ROUTES } from "@/constants/route";
import styles from "./CourtDetailPage.module.css";

function formatTime(timeString: string): string {
    if (!timeString) return "";
    return timeString.substring(0, 5);
}

export default function CourtDetailPage() {
    const navigate = useNavigate();
    const { courtDetail, isLoading, error } = useCourtDetail();


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

                    {/* Court Availability Schedule */}
                    {courtDetail && (
                        <CourtAvailabilitySchedule
                            courtId={courtDetail.id}
                            initialDate={new Date(courtDetail.date)}
                            initialTimeSlotAvailabilities={courtDetail.timeSlotAvailabilities}
                        />
                    )}
                </div>

                {/* Right Column: Info and Booking Form */}
                <div className={styles.rightColumn}>
                    {/* Book Now Button */}
                    <Link
                        to={generatePath(ROUTES.PUBLIC.COURTS.BOOK, { id: courtDetail.id.toString() })}
                        className={styles.bookNowButton}
                    >
                        Đặt sân ngay
                    </Link>

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
