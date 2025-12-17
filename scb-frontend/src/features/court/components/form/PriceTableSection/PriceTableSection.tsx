import { Select } from "@/components/form";
import usePriceTable from "./usePriceTable";
import PriceTable from "./PriceTable";
import styles from "./PriceTableSection.module.css";
import type { BasicPriceTemplate } from "@/features/court/types/price.types";
import type { TimeSlot } from "./priceTable.utils";

export interface PriceTableSectionProps {
    priceTemplates: BasicPriceTemplate[];
    facilityId?: string;
    sportId?: string;
    minTime: number;
    maxTime: number;
    initialTemplateId?: number | null;
    initialSlots?: Array<{ startTime: string; endTime: string; price: number }>;
    onTemplateChange?: (templateId: number | null) => void;
    onSlotsChange?: (slots: TimeSlot[]) => void;
    disabled?: boolean;
    hideTemplateSelect?: boolean;
}

export default function PriceTableSection({
    priceTemplates,
    facilityId,
    sportId,
    minTime,
    maxTime,
    initialTemplateId,
    initialSlots,
    onTemplateChange,
    onSlotsChange,
    disabled = false,
    hideTemplateSelect = false,
}: PriceTableSectionProps) {
    const {
        selectedTemplateId,
        slots,
        isLoadingTemplate,
        filteredTemplates,
        handleTemplateChange,
        handleSlotsChange,
    } = usePriceTable({
        priceTemplates,
        facilityId,
        sportId,
        initialTemplateId,
        initialSlots,
        onTemplateChange,
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
                        value={selectedTemplateId}
                        onChange={handleTemplateChange}
                        options={filteredTemplates.map((template) => ({
                            value: template.id.toString(),
                            label: template.name,
                        }))}
                        disabled={disabled || isLoadingTemplate}
                        name="priceTemplate"
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
