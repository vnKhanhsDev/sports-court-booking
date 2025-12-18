import styles from "./FacilityCard.module.css";
import Badge from "@/components/ui/badge/Badge";
import IconButton from "@/components/ui/button/IconButton";
import { Delete, Edit, Time } from "@/components/ui/icons";
import type { OwnerFacilitySummary } from "../../types/facility.types";

function formatTime(timeString: string): string {
    // Format time from "HH:mm:ss" or "HH:mm" to "HH:mm"
    if (!timeString) return "";
    return timeString.substring(0, 5);
}

interface FacilityCardProps {
    facility: OwnerFacilitySummary;
    onClick?: (facilityId: number) => void;      // view detail
    onEditClick?: (facilityId: number) => void;  // edit mode
    onDeleteClick?: (facilityId: number) => void; // delete
}

export default function FacilityCard({ facility, onClick, onEditClick, onDeleteClick }: FacilityCardProps) {
    const handleCardClick = () => {
        onClick?.(facility.id);
    };

    const handleEditButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        onEditClick?.(facility.id);
    };

    const handleDeleteButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.stopPropagation();
        onDeleteClick?.(facility.id);
    };

    return (
        <div className={styles.card} onClick={handleCardClick}>
            <div className={styles.info}>
                <h2 className={styles.title}>{facility.name}</h2>
                <div className={styles.meta}>
                    <Badge
                        label={facility.totalCourts + " sân"}
                        variant="default"
                    />
                    <Badge
                        label={facility.status}
                        variant={facility.status === "APPROVED" ? "success" : facility.status === "REJECTED" ? "danger" : "warning"}
                    />
                </div>
                <div className={styles.details}>
                    <p className={styles.time}>
                        <Time /> {formatTime(facility.openingTime)} - {formatTime(facility.closingTime)}
                    </p>
                    <p className={styles.address}>{facility.address}</p>
                </div>
            </div>
            <div className={styles.actions}>
                <IconButton onClick={handleEditButtonClick}>
                    <Edit />
                </IconButton>
                <IconButton onClick={handleDeleteButtonClick}>
                    <Delete />
                </IconButton>
            </div>
        </div>
    );
}
