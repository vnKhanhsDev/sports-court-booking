import { useNavigate } from "react-router-dom";
import usePublicFacility from "../hooks/usePublicFacility";
import PublicFacilityCard from "../components/shared/PublicFacilityCard";
import CourtSearchFilter, { type FilterState } from "../components/search/CourtSearchFilter";
import styles from "./CourtSearchPage.module.css";
import { ROUTES } from "@/constants/route";

export default function CourtSearchPage() {
    const { publicFacilities: facilities, isLoading, error } = usePublicFacility();
    console.log(facilities);
    const navigate = useNavigate();

    const handleFacilityClick = (facilityId: number, sportId: number) => {
        // Navigate to facility detail page
        const searchParams = new URLSearchParams({
            sportId: sportId.toString()
        });
        navigate(`${ROUTES.PUBLIC.MARKETPLACE.DETAIL.replace(':id', facilityId.toString())}?${searchParams.toString()}`);
    };

    const handleFilterChange = (filters: FilterState) => {
        // TODO: Implement filtering logic
        console.log("Filter changed:", filters);
    };

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>{error.message || "Đã xảy ra lỗi khi tải danh sách sân."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <aside className={styles.sidebar}>
                    <CourtSearchFilter onFilterChange={handleFilterChange} />
                </aside>

                <main className={styles.main}>
                    {isLoading ? (
                        <div className={styles.loading}>
                            <p>Đang tải danh sách sân...</p>
                        </div>
                    ) : facilities.length === 0 ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>🏟️</div>
                            <h3>Chưa có sân nào</h3>
                            <p>Hiện tại chưa có sân thể thao nào được hiển thị.</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {facilities.map((facility) => (
                                <PublicFacilityCard
                                    key={`${facility.facilityId}-${facility.sportId}`}
                                    facility={facility}
                                    onClick={() => handleFacilityClick(facility.facilityId, facility.sportId)}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}