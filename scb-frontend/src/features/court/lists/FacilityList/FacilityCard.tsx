import styles from "./FacilityCard.module.css";
import Badge from "@/components/ui/badge/Badge";
import IconButton from "@/components/ui/button/IconButton";
import { Delete, Edit, Time } from "@/components/ui/icons";
import type { FacilityBasicForOwner } from "../../types/facility.types";

function formatTime(timeString: string): string {
    // Format time from "HH:mm:ss" or "HH:mm" to "HH:mm"
    if (!timeString) return "";
    return timeString.substring(0, 5);
}

export default function FacilityCard({ facility }: { facility: FacilityBasicForOwner }) {
    return (
        <div className={styles.card} onClick={() => {console.log(facility)}}>
            <div className={styles.info}>
                <h2 className={styles.title}>{facility.name}</h2>
                <div className={styles.meta}>
                    <Badge
                        label={facility.courts.length + " sân"}
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
                <IconButton>
                    <Edit />
                </IconButton>
                <IconButton>
                    <Delete />
                </IconButton>
            </div>
        </div>
    );
}
