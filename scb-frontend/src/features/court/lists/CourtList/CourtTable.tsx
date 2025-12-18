import { useMemo } from "react";
import DataTable, { type Column } from "@/components/ui/DataTable/DataTable";
import Badge from "@/components/ui/badge/Badge";
import type { OwnerCourtSummary } from "../../types/court.types";
import styles from "./CourtTable.module.css";

interface CourtTableProps {
    courts: OwnerCourtSummary[];
    isLoading: boolean;
    title?: string;
    onRowClick?: (court: OwnerCourtSummary) => void;
    onEdit?: (court: OwnerCourtSummary) => void;
    onDelete?: (court: OwnerCourtSummary) => void;
    selectedId?: number;
}

export default function CourtTable({
    courts,
    isLoading,
    title = "Sân",
    onRowClick,
    onEdit,
    onDelete,
    selectedId,
}: CourtTableProps) {
    const columns: Column<OwnerCourtSummary>[] = useMemo(
        () => [
            {
                header: "Tên sân",
                accessor: "name",
                width: "18%",
            },
            {
                header: "Cơ sở",
                accessor: "facilityName",
                width: "18%",
            },
            {
                header: "Trạng thái",
                accessor: "status",
                width: "14%",
                render: (value: string) => {
                    const variant =
                        value === "APPROVED"
                            ? "success"
                            : value === "REJECTED"
                            ? "danger"
                            : "warning";
                    return <Badge label={value} variant={variant} />;
                },
            },
            {
                header: "Đã đặt",
                accessor: "isBooked",
                width: "10%",
                render: (value: boolean) => {
                    return (
                        <Badge
                            label={value ? "Đã đặt" : "Trống"}
                            variant={value ? "warning" : "success"}
                        />
                    );
                },
            },
        ],
        []
    );

    const actions = useMemo(() => {
        if (!onEdit && !onDelete) return undefined;
        return {
            onEdit: onEdit ? (court: OwnerCourtSummary) => onEdit(court) : undefined,
            onDelete: onDelete ? (court: OwnerCourtSummary) => onDelete(court) : undefined,
        };
    }, [onEdit, onDelete]);

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {title} <span>({isLoading ? "..." : courts.length})</span>
                </h1>
            </div>
            <div className={styles.tableContainer}>
                <DataTable<OwnerCourtSummary>
                    data={courts}
                    columns={columns}
                    isLoading={isLoading}
                    emptyMessage="Không có sân nào"
                    keyExtractor={(court) => court.id}
                    onRowClick={onRowClick ? (court) => onRowClick(court) : undefined}
                    selectedId={selectedId}
                    actions={actions}
                />
            </div>
        </section>
    );
}
