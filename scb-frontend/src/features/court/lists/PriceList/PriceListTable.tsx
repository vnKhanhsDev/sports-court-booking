import { useMemo } from "react";
import DataTable, { type Column } from "@/components/ui/DataTable/DataTable";
import Badge from "@/components/ui/badge/Badge";
import type { PriceListSummary } from "../../types/price.types";
import styles from "./PriceListTable.module.css";

interface PriceListTableProps {
    priceLists: PriceListSummary[];
    isLoading: boolean;
    title?: string;
    onRowClick?: (priceList: PriceListSummary) => void;
    onEdit?: (priceList: PriceListSummary) => void;
    onDelete?: (priceList: PriceListSummary) => void;
    selectedId?: number;
}

export default function PriceListTable({
    priceLists,
    isLoading,
    title = "Bảng giá",
    onRowClick,
    onEdit,
    onDelete,
    selectedId,
}: PriceListTableProps) {
    const columns: Column<PriceListSummary>[] = useMemo(
        () => [
            {
                header: "Tên bảng giá",
                accessor: "name",
                width: "40%",
            },
            {
                header: "Phiên bản",
                accessor: "version",
                width: "12%",
                align: "center",
            },
            {
                header: "Số sân đang dùng",
                accessor: "appliedCourtCount",
                width: "15%",
                align: "center",
                render: (value: number) => {
                    return <span>{value}</span>;
                },
            },
            {
                header: "Trạng thái",
                accessor: "isActive",
                width: "15%",
                render: (value: boolean) => {
                    return (
                        <Badge
                            label={value ? "Đang dùng" : "Không dùng"}
                            variant={value ? "success" : "danger"}
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
            onEdit: onEdit ? (priceList: PriceListSummary) => onEdit(priceList) : undefined,
            onDelete: onDelete ? (priceList: PriceListSummary) => onDelete(priceList) : undefined,
        };
    }, [onEdit, onDelete]);

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {title} <span>({isLoading ? "..." : priceLists.length})</span>
                </h1>
            </div>
            <div className={styles.tableContainer}>
                <DataTable<PriceListSummary>
                    data={priceLists}
                    columns={columns}
                    isLoading={isLoading}
                    emptyMessage="Không có bảng giá nào"
                    keyExtractor={(priceList) => priceList.id}
                    onRowClick={onRowClick ? (priceList) => onRowClick(priceList) : undefined}
                    selectedId={selectedId}
                    actions={actions}
                />
            </div>
        </section>
    );
}
