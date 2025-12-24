import type { PublicFacilitySummary } from "../../types/facility.type";
import Carousel from "../../../../../components/ui/carousel/Carousel";
import styles from "./PublicFacilityCard.module.css";

interface PublicFacilityCardProps {
    facility: PublicFacilitySummary;
    onClick?: () => void;
}

function formatPrice(price: number | null): string {
    if (price === null) return '';
    return price.toLocaleString('vi-VN');
}

function getDisplayName(facilityName: string, sportName: string): string {
    // Format: "Field + sport name + facility name"
    // Example: "Phenikaa University Football Field"
    return `Sân ${sportName} ${facilityName}`;
}

export default function PublicFacilityCard({ facility, onClick }: PublicFacilityCardProps) {
    const hasPriceRange = facility.minPrice !== null && facility.maxPrice !== null;
    const isSinglePrice = facility.minPrice !== null && facility.maxPrice !== null && facility.minPrice === facility.maxPrice;
    const displayName = getDisplayName(facility.facilityName, facility.sportName);
    const hasImages = facility.imageUrls && facility.imageUrls.length > 0;

    return (
        <div 
            className={styles.card}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {hasImages && (
                <div className={styles.imageContainer}>
                    <Carousel
                        slides={facility.imageUrls.map((url) => (
                            <img
                                key={url}
                                src={url}
                                alt={displayName}
                                className={styles.image}
                            />
                        ))}
                        autoPlay
                        autoPlayInterval={5000}
                        showIndicators
                        showNavigation = {false}
                        loop
                    />
                </div>
            )}

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.facilityName}>{displayName}</h3>
                </div>

                <div className={styles.info}>
                    <div className={styles.infoRow}>
                        <svg 
                            className={styles.icon} 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className={styles.address}>{facility.address}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <svg 
                            className={styles.icon} 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                            <line x1="15" y1="3" x2="15" y2="21"></line>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="3" y1="15" x2="21" y2="15"></line>
                        </svg>
                        <span className={styles.statValue}>
                            {facility.totalCourts} {facility.totalCourts === 1 ? 'sân' : 'sân'}
                        </span>
                    </div>
                </div>

                {hasPriceRange && (
                    <div className={styles.priceRow}>
                        <span className={styles.priceLabel}>Giá từ</span>
                        <span className={styles.priceValue}>
                            {isSinglePrice ? (
                                formatPrice(facility.minPrice) + '₫'
                            ) : (
                                `${formatPrice(facility.minPrice)}₫ - ${formatPrice(facility.maxPrice)}₫`
                            )}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}