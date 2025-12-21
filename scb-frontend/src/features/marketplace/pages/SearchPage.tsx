import useFacilities from "../hooks/useFacilities";
import FacilityCard from "../components/shared/FacilityCard";
import styles from "./SearchPage.module.css";

export default function SearchPage() {
    const { facilities, isLoading, error } = useFacilities();

    const handleFacilityClick = (facilityId: number) => {
        // TODO: Navigate to court search filtered by facility
        // For now, we can navigate to court search page
        console.log("Facility clicked:", facilityId);
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
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Tìm cơ sở thể thao
                    {!isLoading && <span className={styles.count}>({facilities.length})</span>}
                </h1>
                <p className={styles.subtitle}>
                    Khám phá các cơ sở thể thao với nhiều sân đa dạng
                </p>
            </div>

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
                            key={facility.facilityId}
                            facility={facility}
                            onClick={() => handleFacilityClick(facility.facilityId)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}