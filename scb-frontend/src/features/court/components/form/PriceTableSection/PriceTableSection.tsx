import { Select } from "@/components/form";
import { useMemo } from "react";
import usePriceTable from "./usePriceTable";
import PriceTable from "./PriceTable";
import styles from "./PriceTableSection.module.css";
import type { PriceListOption } from "@/features/court/types/price.types";
import type { TimeSlot } from "./priceTable.utils";

export interface PriceTableSectionProps {
    priceLists: PriceListOption[];
    facilityId?: string;
    sportId?: string;
    minTime: number;
    maxTime: number;
    initialPriceListId?: number | null;
    initialSlots?: Array<{ startTime: string; endTime: string; price: number }>;
    onPriceListChange?: (priceListId: number | null) => void;
    onSlotsChange?: (slots: TimeSlot[]) => void;
    disabled?: boolean;
    hideTemplateSelect?: boolean;
}

export default function PriceTableSection({
    priceLists,
    facilityId,
    sportId,
    minTime,
    maxTime,
    initialPriceListId,
    initialSlots,
    onPriceListChange,
    onSlotsChange,
    disabled = false,
    hideTemplateSelect = false,
}: PriceTableSectionProps) {
    const {
        selectedPriceListId,
        slots,
        isLoadingPriceList,
        filteredPriceLists,
        handlePriceListChange,
        handleSlotsChange,
    } = usePriceTable({
        priceLists,
        facilityId,
        sportId,
        initialPriceListId,
        initialSlots,
        onPriceListChange,
        onSlotsChange,
    });

    // Check if the court uses custom pricing (private price list not in shared lists)
    const hasCustomPricing = useMemo(() => {
        if (!initialPriceListId || !initialSlots || initialSlots.length === 0) {
            return false;
        }
        // If priceListId exists but is not in priceLists (shared lists), it's a private/custom price list
        return !priceLists.some(pl => pl.id === initialPriceListId);
    }, [initialPriceListId, initialSlots, priceLists]);

    // Build options list, adding custom pricing option if needed
    const selectOptions = useMemo(() => {
        const options = filteredPriceLists.map((priceList) => ({
            value: priceList.id.toString(),
            label: priceList.name,
        }));

        // Add custom pricing option if court uses private price list
        if (hasCustomPricing && initialPriceListId) {
            options.unshift({
                value: initialPriceListId.toString(),
                label: "Bảng giá riêng",
            });
        }

        return options;
    }, [filteredPriceLists, hasCustomPricing, initialPriceListId]);

    return (
        <div className={styles.container}>
            <label className={styles.label}>
                Bảng giá theo khung giờ <span className={styles.required}>*</span>
            </label>
            
            {!hideTemplateSelect && (
                <div className={styles.selectWrapper}>
                    <Select
                        placeholder="-- Chọn bảng giá mẫu (tùy chọn) --"
                        value={selectedPriceListId}
                        onChange={handlePriceListChange}
                        options={selectOptions}
                        disabled={disabled || isLoadingPriceList}
                        name="priceList"
                    />
                </div>
            )}

            <div className={styles.tableWrapper}>
                <PriceTable
                    minTime={minTime}
                    maxTime={maxTime}
                    slots={slots}
                    onChange={handleSlotsChange}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
