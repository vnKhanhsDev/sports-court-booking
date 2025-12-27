import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useNearbyFacilities from '../../hooks/useNearbyFacilities';
import PublicFacilityCard from '../shared/PublicFacilityCard';
import { ROUTES } from '@/constants/route';
import type { PublicFacilitySummary } from '../../types/facility.type';
import styles from './NearbyCourts.module.css';

export default function NearbyCourts() {
    const navigate = useNavigate();
    const { nearbyFacilities, isLoading, error, hasLocation, locationLoading } = useNearbyFacilities();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    };

    useEffect(() => {
        checkScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtons);
            window.addEventListener('resize', checkScrollButtons);
            return () => {
                container.removeEventListener('scroll', checkScrollButtons);
                window.removeEventListener('resize', checkScrollButtons);
            };
        }
    }, [nearbyFacilities]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth * 0.8;
        const newScrollLeft = direction === 'left' 
            ? container.scrollLeft - scrollAmount 
            : container.scrollLeft + scrollAmount;
        
        container.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });
    };

    const handleFacilityClick = (facilityId: number, sportId: number) => {
        navigate(`${ROUTES.PUBLIC.MARKETPLACE.DETAIL.replace(':id', facilityId.toString())}?sportId=${sportId}`);
    };

    // Show loading only when actually loading location or fetching data
    if (locationLoading) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Sân thể thao gần đây</h2>
                <div className={styles.loading}>Đang lấy vị trí...</div>
            </div>
        );
    }

    // Show error if geolocation failed
    if (error && !hasLocation) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Sân thể thao gần đây</h2>
                <div className={styles.error}>
                    <p>Không thể lấy vị trí của bạn. Vui lòng cho phép truy cập vị trí để xem các sân thể thao gần đây.</p>
                </div>
            </div>
        );
    }

    // Show loading when fetching facilities
    if (isLoading && hasLocation) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Sân thể thao gần đây</h2>
                <div className={styles.loading}>Đang tải...</div>
            </div>
        );
    }

    // Show empty state if no facilities found
    if (hasLocation && nearbyFacilities.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Sân thể thao gần đây</h2>
                <div className={styles.noResults}>
                    <p>Không tìm thấy sân thể thao gần bạn</p>
                </div>
            </div>
        );
    }

    // Don't render if no location
    if (!hasLocation) {
        return null;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Sân thể thao gần đây</h2>

            <div className={styles.carouselWrapper}>
                {canScrollLeft && (
                    <button
                        className={`${styles.navButton} ${styles.prevButton}`}
                        onClick={() => scroll('left')}
                        aria-label="Cuộn trái"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                )}

                <div 
                    ref={scrollContainerRef}
                    className={styles.facilitiesList}
                >
                    {nearbyFacilities.map((facility: PublicFacilitySummary) => (
                        <div key={`${facility.facilityId}-${facility.sportId}`} className={styles.facilityItem}>
                            <PublicFacilityCard
                                facility={facility}
                                onClick={() => handleFacilityClick(facility.facilityId, facility.sportId)}
                            />
                        </div>
                    ))}
                </div>

                {canScrollRight && (
                    <button
                        className={`${styles.navButton} ${styles.nextButton}`}
                        onClick={() => scroll('right')}
                        aria-label="Cuộn phải"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}