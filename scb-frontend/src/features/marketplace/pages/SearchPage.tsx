import { useNavigate } from "react-router-dom";
import useFacilities from "../hooks/useFacilities";
import FacilityCard from "../components/shared/FacilityCard";
import Filter, { type FilterState } from "../components/search/Filter";
import styles from "./SearchPage.module.css";
import { ROUTES } from "@/constants/route";

export default function SearchPage() {
    const { facilities, isLoading, error } = useFacilities();
    const navigate = useNavigate();

    const handleFacilityClick = (facilityId: number, sportId: number) => {
        // Navigate to court search filtered by facility and sport
        const searchParams = new URLSearchParams({
            facilityId: facilityId.toString(),
            sportId: sportId.toString()
        });
        navigate(`${ROUTES.PUBLIC.COURTS.SEARCH}?${searchParams.toString()}`);
    };

    const handleFilterChange = (filters: FilterState) => {
        // TODO: Implement filtering logic
        console.log("Filter changed:", filters);
    };

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <aside className={styles.sidebar}>
                    <Filter onFilterChange={handleFilterChange} />
                </aside>

                <main className={styles.main}>
                    {isLoading ? (
                        <div className={styles.loading}>
                            <p>Đang tải danh sách cơ sở...</p>
                        </div>
                    ) : facilities.length === 0 ? (
                        <div className={styles.empty}>
                            <div className={styles.emptyIcon}>🏢</div>
                            <h3>Chưa có cơ sở nào</h3>
                            <p>Hiện tại chưa có cơ sở thể thao nào được hiển thị.</p>
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {facilities.map((facility) => (
                                <FacilityCard
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