import { useMemo } from "react";
import DataTable, { type Column } from "@/components/ui/DataTable/DataTable";
import Badge from "@/components/ui/badge/Badge";
import type { AdminFacilitySummary } from "../../types/facility.types";
import styles from "./AdminFacilityTable.module.css";

interface AdminFacilityTableProps {
    facilities: AdminFacilitySummary[];
    isLoading: boolean;
    title?: string;
    onApprove?: (facility: AdminFacilitySummary) => void;
    onReject?: (facility: AdminFacilitySummary) => void;
    selectedId?: number;
}

export default function AdminFacilityTable({
    facilities,
    isLoading,
    title = "Cơ sở",
    onApprove,
    onReject,
    selectedId,
}: AdminFacilityTableProps) {
    const columns: Column<AdminFacilitySummary>[] = useMemo(
        () => [
            {
                header: "Tên cơ sở",
                accessor: "name",
                width: "25%",
            },
            {
                header: "Email chủ sở hữu",
                accessor: "ownerEmail",
                width: "25%",
            },
            {
                header: "Số sân",
                accessor: "totalCourts",
                width: "12%",
                align: "center",
                render: (value: number) => {
                    return <span>{value}</span>;
                },
            },
            {
                header: "Trạng thái",
                accessor: "status",
                width: "15%",
                render: (value: string) => {
                    const variant =
                        value === "APPROVED"
                            ? "success"
                            : value === "REJECTED"
                            ? "danger"
                            : value === "PENDING"
                            ? "warning"
                            : "default";
                    return <Badge label={value} variant={variant} />;
                },
            },
            {
                header: "Hành động",
                accessor: "__actions__",
                width: "23%",
                align: "center",
                render: (_value: any, row: AdminFacilitySummary) => {
                    const isPending = row.status === "PENDING";
                    return (
                        <div className={styles.actionsCell}>
                            {isPending && (
                                <>
                                    {onApprove && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onApprove(row);
                                            }}
                                            className={styles.approveButton}
                                        >
                                            Phê duyệt
                                        </button>
                                    )}
                                    {onReject && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onReject(row);
                                            }}
                                            className={styles.rejectButton}
                                        >
                                            Từ chối
                                        </button>
                                    )}
                                </>
                            )}
                            {!isPending && (
                                <span className={styles.noAction}>—</span>
                            )}
                        </div>
                    );
                },
            },
        ],
        [onApprove, onReject]
    );

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {title} <span>({isLoading ? "..." : facilities.length})</span>
                </h1>
            </div>
            <div className={styles.tableContainer}>
                <DataTable<AdminFacilitySummary>
                    data={facilities}
                    columns={columns}
                    isLoading={isLoading}
                    emptyMessage="Không có cơ sở nào"
                    keyExtractor={(facility) => facility.id}
                    selectedId={selectedId}
                    showPagination={true}
                    itemsPerPage={10}
                />
            </div>
        </section>
    );
}
