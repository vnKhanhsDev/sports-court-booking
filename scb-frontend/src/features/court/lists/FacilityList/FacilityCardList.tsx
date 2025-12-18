import type { OwnerFacilitySummary } from "../../types/facility.types";
import FacilityCard from "./FacilityCard";
import { LocationOutlined } from "@/components/ui/icons";
import styles from "./FacilityCardList.module.css";

interface FacilityCardListProps {
    facilities: OwnerFacilitySummary[];
    isLoading: boolean;
    onFacilityClick?: (facilityId: number) => void;       // view
    onFacilityEditClick?: (facilityId: number) => void;   // edit
    onFacilityDeleteClick?: (facilityId: number) => void; // delete
}

export default function FacilityCardList({ facilities, isLoading, onFacilityClick, onFacilityEditClick, onFacilityDeleteClick }: FacilityCardListProps) {
    if (isLoading) {
        return (
            <section className={styles.wrapper}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Cơ sở <span>(...)</span></h1>
                </div>
                <div className={styles.loadingState}>Loading facilities...</div>
            </section>
        );
    }

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h1 className={styles.title}>Cơ sở <span>({facilities.length})</span></h1>
            </div>
            <div className={styles.listContainer}>
                <div className={styles.list}>
                    {facilities.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <LocationOutlined />
                            </div>
                            <p className={styles.emptyText}>Không có cơ sở nào</p>
                        </div>
                    ) : (
                        facilities.map((facility) => (
                            <FacilityCard
                                key={facility.id}
                                facility={facility}
                                onClick={onFacilityClick}
                                onEditClick={onFacilityEditClick}
                                onDeleteClick={onFacilityDeleteClick}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
