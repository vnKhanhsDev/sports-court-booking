import type { PublicFacilitySummary } from "../../types/facility.type";
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
    return `Sân ${sportName} ${facilityName}`;
}

export default function PublicFacilityCard({ facility, onClick }: PublicFacilityCardProps) {
    const hasPriceRange = facility.minPrice !== null && facility.maxPrice !== null;
    const isSinglePrice = facility.minPrice !== null && facility.maxPrice !== null && facility.minPrice === facility.maxPrice;
    const displayName = getDisplayName(facility.facilityName, facility.sportName);
    const hasImage = facility.imageUrls && facility.imageUrls.length > 0;

    return (
        <div 
            className={styles.card}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <div className={styles.cardImage}>
                {!hasImage ? (
                    <div className={styles.placeholder}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.75"
                            className={styles.icon}
                        >
                            <rect x="2" y="5" width="20" height="14" rx="1" />
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <rect x="2" y="8" width="3" height="8" rx="0.5" />
                            <rect x="19" y="8" width="3" height="8" rx="0.5" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                ) : (
                    <img src={facility.imageUrls[0]} alt={displayName} className={styles.image} />
                )}
            </div>

            <div className={styles.cardContent}>
                <div className={styles.header}>
                    <span className={styles.sportName}>sân {facility.sportName}</span>
                    <h3 className={styles.facilityName}>{facility.facilityName}</h3>
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
                            strokeWidth="1.5"
                        >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span className={styles.address}>{facility.address}</span>
                    </div>

                    <div className={styles.infoRow}>
                        <svg
                            className={styles.icon}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        >
                            <rect x="2" y="5" width="20" height="14" rx="1" />
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <rect x="2" y="8" width="3" height="8" rx="0.5" />
                            <rect x="19" y="8" width="3" height="8" rx="0.5" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span className={styles.statValue}>
                            {facility.totalCourts} sân
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