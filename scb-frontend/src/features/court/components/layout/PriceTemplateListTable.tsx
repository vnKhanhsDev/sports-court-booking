import { useMemo } from 'react';
import DataTable, { type Column } from '@/components/ui/DataTable/DataTable';
import Badge from '@/components/ui/badge/Badge';
import type { PriceTemplateBasic } from '../../types/price.types';
import styles from './PriceTemplateListTable.module.css';

interface PriceTemplateListTableProps {
    priceTemplates: PriceTemplateBasic[];
    isLoading: boolean;
    title?: string;
    onRowClick?: (priceTemplate: PriceTemplateBasic) => void;
    onEdit?: (priceTemplate: PriceTemplateBasic) => void;
    onDelete?: (priceTemplate: PriceTemplateBasic) => void;
    selectedId?: number;
}

export default function PriceTemplateListTable({
    priceTemplates,
    isLoading,
    title = 'Bảng giá',
    onRowClick,
    onEdit,
    onDelete,
    selectedId,
}: PriceTemplateListTableProps) {
    const columns: Column<PriceTemplateBasic>[] = useMemo(
        () => [
            {
                header: 'Tên bảng giá',
                accessor: 'name',
                width: '20%',
            },
            {
                header: 'Cơ sở',
                accessor: 'facilityName',
                width: '20%',
                render: (value: string | null) => value || '—',
            },
            {
                header: 'Môn thể thao',
                accessor: 'sportName',
                width: '18%',
                render: (value: string | null) => value || '—',
            },
            {
                header: 'Phiên bản',
                accessor: 'version',
                width: '12%',
                align: 'center',
            },
            {
                header: 'Trạng thái',
                accessor: 'isActive',
                width: '15%',
                render: (value: boolean) => {
                    return (
                        <Badge
                            label={value ? 'Đang dùng' : 'Không dùng'}
                            variant={value ? 'success' : 'danger'}
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
            onEdit: onEdit ? (priceTemplate: PriceTemplateBasic) => onEdit(priceTemplate) : undefined,
            onDelete: onDelete ? (priceTemplate: PriceTemplateBasic) => onDelete(priceTemplate) : undefined,
        };
    }, [onEdit, onDelete]);

    return (
        <section className={styles.wrapper}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {title} <span>({isLoading ? '...' : priceTemplates.length})</span>
                </h1>
            </div>
            <div className={styles.tableContainer}>
                <DataTable<PriceTemplateBasic>
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
