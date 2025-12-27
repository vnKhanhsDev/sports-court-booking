import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import usePublicFacilityDetail from "../hooks/usePublicFacilityDetail";
import BookingTimeSelector from "../components/detail/BookingTimeSelector";
import styles from "./CourtDetailPage.module.css";

export default function CourtDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const sportId = searchParams.get("sportId");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const { facility, isLoading, error } = usePublicFacilityDetail(
        id ? Number(id) : null,
        sportId ? Number(sportId) : null
    );

    const handlePrevious = () => {
        if (!facility?.imageUrls) return;
        setCurrentImageIndex((prev) => 
            prev === 0 ? facility.imageUrls.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        if (!facility?.imageUrls) return;
        setCurrentImageIndex((prev) => 
            prev === facility.imageUrls.length - 1 ? 0 : prev + 1
        );
    };

    const handleIndicatorClick = (index: number) => {
        setCurrentImageIndex(index);
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <p>Đang tải thông tin cơ sở...</p>
                </div>
            </div>
        );
    }

    if (error || !facility) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>{error || "Không tìm thấy thông tin cơ sở"}</p>
                </div>
            </div>
        );
    }

    const displayName = `Sân ${facility.sportName} ${facility.facilityName}`;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{displayName}</h1>
                <div className={styles.address}>
                    <svg 
                        className={styles.addressIcon} 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{facility.fullAddress || "Chưa có địa chỉ"}</span>
                </div>
            </div>

            {/* Main Content: Images and Info Sidebar */}
            <div className={styles.mainContent}>
                {/* Image Carousel - Left Side */}
                {facility.imageUrls && facility.imageUrls.length > 0 ? (
                    <div className={styles.imageCarousel}>
                        <div className={styles.carouselContainer}>
                            <div 
                                className={styles.carouselTrack}
                                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                            >
                                {facility.imageUrls.map((url, index) => (
                                    <div key={index} className={styles.carouselSlide}>
                                        <img
                                            src={url}
                                            alt={`${facility.facilityName} - Image ${index + 1}`}
                                            className={styles.carouselImage}
                                            loading={index === 0 ? "eager" : "lazy"}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        {facility.imageUrls.length > 1 && (
                            <>
                                <button
                                    className={styles.carouselButton}
                                    onClick={handlePrevious}
                                    aria-label="Previous image"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <button
                                    className={`${styles.carouselButton} ${styles.carouselButtonNext}`}
                                    onClick={handleNext}
                                    aria-label="Next image"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Indicators */}
                        {facility.imageUrls.length > 1 && (
                            <div className={styles.carouselIndicators}>
                                {facility.imageUrls.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`${styles.indicator} ${index === currentImageIndex ? styles.active : ''}`}
                                        onClick={() => handleIndicatorClick(index)}
                                        aria-label={`Go to image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Image Counter */}
                        {facility.imageUrls.length > 1 && (
                            <div className={styles.imageCounter}>
                                {currentImageIndex + 1} / {facility.imageUrls.length}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.noImages}>
                        <svg 
                            width="48" 
                            height="48" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <p>Chưa có hình ảnh</p>
                    </div>
                )}

                {/* Information Sidebar - Right Side */}
                <div className={styles.infoSidebar}>
                    <div className={styles.infoCard}>
                        <h2 className={styles.infoCardTitle}>Thông tin sân</h2>
                        <div className={styles.infoList}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Giờ mở cửa:</span>
                                <span className={styles.infoValue}>
                                    {facility.openingTime.substring(0, 5)} - {facility.closingTime.substring(0, 5)}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Số sân thi đấu:</span>
                                <span className={styles.infoValue}>{facility.totalCourts} Sân</span>
                            </div>
                            {facility.minPrice !== null && facility.maxPrice !== null && (
                                <div className={styles.infoRow}>
                                    <span className={styles.infoLabel}>Giá thuê:</span>
                                    <span className={styles.infoValue}>
                                        {facility.minPrice === facility.maxPrice ? (
                                            <span className={styles.price}>
                                                {facility.minPrice.toLocaleString('vi-VN')}₫/giờ
                                            </span>
                                        ) : (
                                            <span className={styles.price}>
                                                {facility.minPrice.toLocaleString('vi-VN')}₫ - {facility.maxPrice.toLocaleString('vi-VN')}₫/giờ
                                            </span>
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {facility.facilityDescription && (
                        <div className={styles.descriptionCard}>
                            <h2 className={styles.infoCardTitle}>Mô tả</h2>
                            <p className={styles.description}>{facility.facilityDescription}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Time Selector */}
            <BookingTimeSelector
                openingTime={facility.openingTime}
                closingTime={facility.closingTime}
                courts={facility.courts}
                facilityId={facility.facilityId}
                facilityName={facility.facilityName}
            />
        </div>
    );
}