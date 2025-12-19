import { Select } from "@/components/form";
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
                        options={filteredPriceLists.map((priceList) => ({
                            value: priceList.id.toString(),
                            label: priceList.name,
                        }))}
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
