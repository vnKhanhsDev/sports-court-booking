import type { PublicFacility } from "../../types/facility.types";
import styles from "./FacilityCard.module.css";

interface FacilityCardProps {
    facility: PublicFacility;
    onClick?: () => void;
}

function formatPrice(price: number): string {
    return price.toLocaleString('vi-VN');
}

export default function FacilityCard({ facility, onClick }: FacilityCardProps) {
    const hasPriceRange = facility.minPrice !== null && facility.maxPrice !== null;
    const isSinglePrice = facility.minPrice === facility.maxPrice;

    return (
        <div 
            className={styles.card}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    <h3 className={styles.facilityName}>{facility.facilityName}</h3>
                    <span className={styles.sportBadge}>{facility.sportName}</span>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.addressRow}>
                    <svg 
                        className={styles.icon} 
                        width="16" 
                        height="16" 
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

                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <svg 
                            className={styles.icon} 
                            width="16" 
                            height="16" 
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
                    <div className={styles.priceSection}>
                        <div className={styles.priceLabel}>Giá từ</div>
                        <div className={styles.priceValue}>
                            {isSinglePrice ? (
                                <span>{formatPrice(facility.minPrice)}₫</span>
                            ) : (
                                <span>
                                    {formatPrice(facility.minPrice)}₫ - {formatPrice(facility.maxPrice)}₫
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}