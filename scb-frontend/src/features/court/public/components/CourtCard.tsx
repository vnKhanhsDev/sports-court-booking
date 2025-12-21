import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/route";
import type { PublicCourt } from "@/features/court/types/court.types";
import styles from "./CourtCard.module.css";

interface CourtCardProps {
    court: PublicCourt;
}

function formatTime(timeString: string): string {
    // Format time from "HH:mm:ss" to "HH:mm"
    if (!timeString) return "";
    return timeString.substring(0, 5);
}

function getMinPrice(priceSlots: PublicCourt["priceSlots"]): number | null {
    if (!priceSlots || priceSlots.length === 0) return null;
    const prices = priceSlots.map(slot => Number(slot.price));
    return Math.min(...prices);
}

function getPrimaryImage(images: PublicCourt["images"]): string | null {
    if (!images || images.length === 0) return null;
    // Sort by displayOrder and get the first one
    const sortedImages = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
    return sortedImages[0].imageUrl;
}

export default function CourtCard({ court }: CourtCardProps) {
    const primaryImage = getPrimaryImage(court.images);
    const minPrice = getMinPrice(court.priceSlots);

    return (
        <Link 
            to={ROUTES.PUBLIC.COURTS.DETAIL.replace(':id', court.id.toString())}
            className={styles.card}
        >
            <div className={styles.imageContainer}>
                {primaryImage ? (
                    <img 
                        src={primaryImage} 
                        alt={court.name}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <span>Không có hình ảnh</span>
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.facilityName}>{court.facilityName}</h3>
                    <p className={styles.courtName}>{court.name}</p>
                </div>

                {minPrice !== null && (
                    <div className={styles.price}>
                        <span className={styles.priceLabel}>Giá từ:</span>
                        <span className={styles.priceValue}>{minPrice.toLocaleString('vi-VN')}₫</span>
                    </div>
                )}

                <div className={styles.meta}>
                    <div className={styles.metaRow}>
                        <span className={styles.metaItem}>Môn: {court.sportName}</span>
                        <span className={styles.metaSeparator}>•</span>
                        <span className={styles.metaItem}>Mặt sân: {court.surfaceTypeName}</span>
                    </div>
                    <div className={styles.metaRow}>
                        <span className={styles.metaItem}>Loại: {court.courtTypeName}</span>
                    </div>
                    <div className={styles.metaRow}>
                        <span className={styles.metaItem}>Khu vực: {court.facilityAddress}</span>
                    </div>
                    <div className={styles.metaRow}>
                        <span className={styles.metaItem}>
                            Giờ mở cửa: {formatTime(court.facilityOpeningTime)} - {formatTime(court.facilityClosingTime)}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
