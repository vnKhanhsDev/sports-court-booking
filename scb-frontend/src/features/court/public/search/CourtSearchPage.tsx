import useCourtSearch from "./useCourtSearch";
import CourtCard from "../components/CourtCard";
import styles from "./CourtSearchPage.module.css";

export default function CourtSearchPage() {
    const { courts, isLoading, error } = useCourtSearch();

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
                    Tìm sân thể thao
                    {!isLoading && <span className={styles.count}>({courts.length})</span>}
                </h1>
            </div>

            {isLoading ? (
                <div className={styles.loading}>
                    <p>Đang tải danh sách sân...</p>
                </div>
            ) : courts.length === 0 ? (
                <div className={styles.empty}>
                    <p>Không tìm thấy sân nào.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {courts.map((court) => (
                        <CourtCard key={court.id} court={court} />
                    ))}
                </div>
            )}
        </div>
    );
}
