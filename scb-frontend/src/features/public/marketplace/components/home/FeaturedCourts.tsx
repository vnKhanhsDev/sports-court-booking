import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePublicCatalog from '@/hooks/usePublicCatalog';
import useFeaturedFacilities from '../../hooks/useFeaturedFacilities';
import PublicFacilityCard from '../shared/PublicFacilityCard';
import { ROUTES } from '@/constants/route';
import type { PublicFacilitySummary } from '../../types/facility.type';
import Button from '@/components/ui/button/Button';
import styles from './FeaturedCourts.module.css';
import clsx from 'clsx';

export default function FeaturedCourts() {
    const navigate = useNavigate();
    const { catalog, catalogLoading } = usePublicCatalog();
    const [selectedSportId, setSelectedSportId] = useState<number | null>(null);
    const { featuredFacilities, isLoading: facilitiesLoading } = useFeaturedFacilities(selectedSportId);

    // Set first sport as selected when catalog loads
    useEffect(() => {
        if (catalog && catalog.length > 0 && selectedSportId === null) {
            setSelectedSportId(catalog[0].id);
        }
    }, [catalog, selectedSportId]);

    const handleFacilityClick = (facilityId: number, sportId: number) => {
        navigate(`${ROUTES.PUBLIC.MARKETPLACE.DETAIL.replace(':id', facilityId.toString())}?sportId=${sportId}`);
    };

    const handleSeeMore = () => {
        navigate(ROUTES.PUBLIC.MARKETPLACE.SEARCH);
    };

    if (catalogLoading || (facilitiesLoading && selectedSportId !== null)) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading...</div>
            </div>
        );
    }

    // Don't render if no catalog or no sport selected
    if (!catalog || catalog.length === 0 || selectedSportId === null) {
        return null;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Sân nổi bật</h2>

            {/* Sports Filter */}
            <div className={styles.sportsFilter}>
                <div className={clsx(styles.blurEdges, styles.left)}></div>

                <div className={styles.sportsList}>
                    {catalog.map((sport) => (
                        <button
                            key={sport.id}
                            onClick={() => setSelectedSportId(sport.id)}
                        >
                            <div className={clsx(
                                styles.sportItem,
                                selectedSportId === sport.id && styles.active
                            )}>
                                <div className={styles.sportImage}>
                                    <img src={sport.imageUrl} alt={sport.name} />
                                </div>
                                <span className={styles.sportName}>{sport.name}</span>
                            </div>
                        </button>
                    ))}
                </div>

                <div className={styles.blurEdges}></div>
            </div>

            {/* Facilities Grid */}
            <div className={styles.facilitiesGrid}>
                {featuredFacilities.length === 0 ? (
                    <div className={styles.noResults}>
                        <p>Không có sân nổi bật cho môn thể thao này</p>
                    </div>
                ) : (
                    featuredFacilities.map((facility: PublicFacilitySummary) => (
                        <PublicFacilityCard
                            key={facility.facilityId}
                            facility={facility}
                            onClick={() => handleFacilityClick(facility.facilityId, facility.sportId)}
                        />
                    ))
                )}
            </div>

            {/* See More Button */}
            <div className={styles.seeMoreContainer}>
                <button
                    onClick={handleSeeMore}
                    className={styles.seeMoreButton}
                >
                    Xem thêm sân
                </button>
            </div>
        </div>
    );
}

