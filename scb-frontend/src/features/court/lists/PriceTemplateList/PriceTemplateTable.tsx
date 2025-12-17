import { useMemo } from "react";
import DataTable, { type Column } from "@/components/ui/DataTable/DataTable";
import Badge from "@/components/ui/badge/Badge";
import type { PriceTemplateSummary } from "../../types/price.types";
import styles from "./PriceTemplateTable.module.css";

interface PriceTemplateTableProps {
    priceTemplates: PriceTemplateSummary[];
    isLoading: boolean;
    title?: string;
    onRowClick?: (priceTemplate: PriceTemplateSummary) => void;
    onEdit?: (priceTemplate: PriceTemplateSummary) => void;
    onDelete?: (priceTemplate: PriceTemplateSummary) => void;
    selectedId?: number;
}

export default function PriceTemplateTable({
    priceTemplates,
    isLoading,
    title = "Bảng giá",
    onRowClick,
    onEdit,
    onDelete,
    selectedId,
}: PriceTemplateTableProps) {
    const columns: Column<PriceTemplateSummary>[] = useMemo(
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
            onEdit: onEdit ? (priceTemplate: PriceTemplateSummary) => onEdit(priceTemplate) : undefined,
            onDelete: onDelete ? (priceTemplate: PriceTemplateSummary) => onDelete(priceTemplate) : undefined,
        };
    }, [onEdit, onDelete]);

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {title} <span>({isLoading ? "..." : priceTemplates.length})</span>
                </h1>
            </div>
            <div className={styles.tableContainer}>
                <DataTable<PriceTemplateSummary>
                    data={priceTemplates}
                    columns={columns}
                    isLoading={isLoading}
                    emptyMessage="Không có bảng giá nào"
                    keyExtractor={(priceTemplate) => priceTemplate.id}
                    onRowClick={onRowClick ? (priceTemplate) => onRowClick(priceTemplate) : undefined}
                    selectedId={selectedId}
                    actions={actions}
                />
            </div>
        </section>
    );
}
