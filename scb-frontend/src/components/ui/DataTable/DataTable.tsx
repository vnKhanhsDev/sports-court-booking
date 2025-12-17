import { useMemo, useState, useEffect } from 'react';
import clsx from 'clsx';
import IconButton from '@/components/ui/button/IconButton';
import { Edit, Delete } from '@/components/ui/icons';
import Pagination from '@/components/ui/pagination/Pagination';
import styles from './DataTable.module.css';

export type ColumnAlign = 'left' | 'center' | 'right';

export interface Column<T> {
    header: string;
    accessor: keyof T | string;
    render?: (value: any, row: T, index: number) => React.ReactNode;
    width?: string | number;
    align?: ColumnAlign;
}

export interface TableActions<T> {
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    emptyMessage?: string;
    onRowClick?: (row: T, index: number) => void;
    selectedId?: string | number;
    keyExtractor: (row: T, index: number) => string | number;
    actions?: TableActions<T>;
    itemsPerPage?: number;
    showPagination?: boolean;
}

function DataTable<T extends Record<string, any>>({
    data,
    columns,
    isLoading = false,
    emptyMessage = 'No data available',
    onRowClick,
    selectedId,
    keyExtractor,
    actions,
    itemsPerPage = 10,
    showPagination = true,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 when data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [data.length]);

    // Calculate pagination
    const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = useMemo(() => {
        if (!showPagination || data.length <= itemsPerPage) {
            return data;
        }
        return data.slice(startIndex, endIndex);
    }, [data, startIndex, endIndex, showPagination, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of table when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // Memoize columns with sequence number and actions column
    const allColumns = useMemo(() => {
        const sequenceNumberColumn: Column<T> = {
            header: 'STT',
            accessor: '__sequence__',
            align: 'center' as ColumnAlign,
            width: '50px',
        };

        const baseColumns = [sequenceNumberColumn, ...columns];

        if (actions) {
            return [
                ...baseColumns,
                {
                    header: 'Hành động',
                    accessor: '__actions__',
                    align: 'center' as ColumnAlign,
                    width: '120px',
                } as Column<T>,
            ];
        }
        return baseColumns;
    }, [columns, actions]);

    // Get cell value from row
    const getCellValue = (column: Column<T>, row: T, _index: number, actualIndex: number): React.ReactNode => {
        if (column.accessor === '__sequence__') {
            return actualIndex + 1;
        }

        if (column.accessor === '__actions__' && actions) {
            return (
                <div className={styles.actionsCell}>
                    {actions.onEdit && (
                        <IconButton
                            onClick={(e) => {
                                e?.stopPropagation();
                                actions.onEdit?.(row);
                            }}
                            className={styles.actionButton}
                        >
                            <Edit />
                        </IconButton>
                    )}
                    {actions.onDelete && (
                        <IconButton
                            onClick={(e) => {
                                e?.stopPropagation();
                                actions.onDelete?.(row);
                            }}
                            className={styles.actionButton}
                        >
                            <Delete />
                        </IconButton>
                    )}
                </div>
            );
        }

        if (column.render) {
            return column.render(row[column.accessor as keyof T], row, actualIndex);
        }

        const value = row[column.accessor as keyof T];
        return value !== null && value !== undefined ? String(value) : '—';
    };

    // Loading state
    if (isLoading) {
        return (
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            {allColumns.map((column, index) => (
                                <th
                                    key={index}
                                    className={styles.th}
                                    style={{
                                        width: column.width,
                                        textAlign: column.align || 'left',
                                    }}
                                >
                                    <div className={styles.skeletonHeader} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {[...Array(5)].map((_, rowIndex) => (
                            <tr key={rowIndex} className={styles.tr}>
                                {allColumns.map((_, colIndex) => (
                                    <td key={colIndex} className={styles.td}>
                                        <div className={styles.skeletonCell} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    // Empty state
    if (data.length === 0) {
        return (
            <div className={styles.tableWrapper}>
                <div className={styles.emptyState}>
                    <p className={styles.emptyMessage}>{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            {allColumns.map((column, index) => (
                                <th
                                    key={index}
                                    className={styles.th}
                                    style={{
                                        width: column.width,
                                        textAlign: column.align || 'left',
                                    }}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {paginatedData.map((row, rowIndex) => {
                            const actualIndex = startIndex + rowIndex;
                            const rowKey = keyExtractor(row, actualIndex);
                            const isSelected = selectedId !== undefined && String(rowKey) === String(selectedId);
                            
                            return (
                                <tr
                                    key={rowKey}
                                    className={clsx(styles.tr, {
                                        [styles.selected]: isSelected,
                                        [styles.clickable]: onRowClick,
                                    })}
                                    onClick={() => onRowClick?.(row, actualIndex)}
                                >
                                    {allColumns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={styles.td}
                                        style={{
                                            width: column.width,
                                            textAlign: column.align || 'left',
                                        }}
                                    >
                                            {getCellValue(column, row, rowIndex, actualIndex)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {showPagination && data.length > itemsPerPage && (
                <div className={styles.paginationWrapper}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}

export default DataTable;
