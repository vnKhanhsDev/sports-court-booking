import { Fragment, useMemo } from "react";
import { Delete } from "@/components/ui/icons";
import styles from "./PriceTable.module.css";
import {
    formatTime,
    generateTimeOptions,
    parseTimeToHour,
    normalizeTimeString,
    type TimeSlot,
    validateSlots,
} from "./priceTable.utils";

interface PriceTableProps {
    minTime: number;
    maxTime: number;
    slots: TimeSlot[];
    onChange: (slots: TimeSlot[]) => void;
    disabled?: boolean;
}

export default function PriceTable({
    minTime,
    maxTime,
    slots,
    onChange,
    disabled = false,
}: PriceTableProps) {
    const timeOptions = useMemo(
        () => generateTimeOptions(minTime, maxTime),
        [minTime, maxTime]
    );

    const sortedSlots = useMemo(
        () =>
            [...slots].sort(
                (a, b) => parseTimeToHour(a.startTime) - parseTimeToHour(b.startTime)
            ),
        [slots]
    );

    const slotErrors = useMemo(() => validateSlots(sortedSlots), [sortedSlots]);

    const handleAddSlot = () => {
        let newStartTime: number;

        if (sortedSlots.length > 0) {
            const lastSlot = sortedSlots[sortedSlots.length - 1];
            newStartTime = parseTimeToHour(lastSlot.endTime);
        } else {
            newStartTime = minTime;
        }

        if (newStartTime >= maxTime) return;

        const newEndTime = Math.min(newStartTime + 1, maxTime);

        const newSlot: TimeSlot = {
            id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            startTime: formatTime(newStartTime),
            endTime: formatTime(newEndTime),
            price: "",
        };

        const next = [...sortedSlots, newSlot].sort(
            (a, b) => parseTimeToHour(a.startTime) - parseTimeToHour(b.startTime)
        );
        onChange(next);
    };

    const handleDelete = (id: string) => {
        const next = slots
            .filter((slot) => slot.id !== id)
            .sort((a, b) => parseTimeToHour(a.startTime) - parseTimeToHour(b.startTime));
        onChange(next);
    };

    const handleUpdateSlot = (id: string, field: keyof TimeSlot, value: string) => {
        // Guard price input to numeric only
        if (field === "price" && !/^\d*$/.test(value)) {
            return;
        }

        const normalizedValue =
            field === "startTime" || field === "endTime" ? normalizeTimeString(value) : value;

        const updated = slots
            .map((slot) => (slot.id === id ? { ...slot, [field]: normalizedValue } : slot))
            .sort((a, b) => parseTimeToHour(a.startTime) - parseTimeToHour(b.startTime));
        onChange(updated);
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.headerCell}>Bắt đầu</th>
                        <th className={styles.headerCell}>Kết thúc</th>
                        <th className={styles.headerCell}>Giá</th>
                        <th className={styles.headerCell}></th>
                    </tr>
                </thead>
                <tbody>
                    {sortedSlots.map((slot) => {
                        const error = slotErrors.get(slot.id);
                        const hasError = Boolean(error);

                        return (
                            <Fragment key={slot.id}>
                                <tr className={`${styles.row} ${hasError ? styles.rowError : ""}`}>
                                    <td className={styles.cell}>
                                        <div className={styles.inputWrapper}>
                                            <select
                                                className={`${styles.select} ${
                                                    error?.invalidTimeRange || error?.overlaps
                                                        ? styles.selectError
                                                        : ""
                                                }`}
                                                value={slot.startTime}
                                                onChange={(e) =>
                                                    handleUpdateSlot(slot.id, "startTime", e.target.value)
                                                }
                                                disabled={disabled}
                                            >
                                                {timeOptions.map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className={styles.cell}>
                                        <div className={styles.inputWrapper}>
                                            <select
                                                className={`${styles.select} ${
                                                    error?.invalidTimeRange || error?.overlaps
                                                        ? styles.selectError
                                                        : ""
                                                }`}
                                                value={slot.endTime}
                                                onChange={(e) =>
                                                    handleUpdateSlot(slot.id, "endTime", e.target.value)
                                                }
                                                disabled={disabled}
                                            >
                                                {timeOptions.map((time) => (
                                                    <option key={time} value={time}>
                                                        {time}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className={styles.cell}>
                                        <div className={styles.inputWrapper}>
                                            <input
                                                type="text"
                                                className={styles.priceInput}
                                                value={slot.price}
                                                onChange={(e) =>
                                                    handleUpdateSlot(slot.id, "price", e.target.value)
                                                }
                                                placeholder="0"
                                                disabled={disabled}
                                            />
                                        </div>
                                    </td>
                                    <td className={styles.cell}>
                                        <button
                                            type="button"
                                            className={styles.deleteButton}
                                            onClick={() => handleDelete(slot.id)}
                                            aria-label="Xóa khung giờ"
                                            disabled={disabled}
                                        >
                                            <Delete />
                                        </button>
                                    </td>
                                </tr>
                                {hasError && (
                                    <tr className={styles.errorRow}>
                                        <td colSpan={4} className={styles.errorCell}>
                                            {error?.invalidTimeRange && (
                                                <span className={styles.errorMessage}>
                                                    Thời gian kết thúc phải lớn hơn thời gian bắt đầu
                                                </span>
                                            )}
                                            {error?.overlaps && (
                                                <span className={styles.errorMessage}>
                                                    Khung giờ này trùng với khung giờ khác
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        );
                    })}
                    <tr>
                        <td colSpan={4} className={styles.addButtonCell}>
                            <button
                                type="button"
                                className={styles.addButton}
                                onClick={handleAddSlot}
                                disabled={disabled}
                            >
                                + Thêm khung giờ
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
