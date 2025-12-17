import { useEffect, useRef, useState } from "react";
import { TextField } from "@/components/form";
import PriceTableSection from "../../components/form/PriceTableSection/PriceTableSection";
import type { TimeSlot } from "../../components/form/PriceTableSection/priceTable.utils";
import { normalizeTimeString } from "../../components/form/PriceTableSection/priceTable.utils";
import styles from "./PriceTemplateForm.module.css";
import CourtAttributeSection, {
    type CourtAttributeErrors,
    type CourtAttributeValues,
} from "../../components/form/CourtAttributeSection/CourtAttributeSection";
import useFacility from "../../hooks/useFacility";
import useCatalog from "@/hooks/useCatalog";

export interface PriceTemplateFormValues {
    facilityId: number | null;
    sportId: number | null;
    courtTypeId: number | null;
    surfaceTypeId: number | null;
    name: string;
    description?: string;
    isActive: boolean;
    items: Array<{ startTime: string; endTime: string; price: number }>;
}

interface PriceTemplateFormProps {
    onSubmit?: (values: PriceTemplateFormValues) => void;
    onCancel?: () => void;
    mode?: "create" | "view" | "edit";
    initialValues?: PriceTemplateFormValues;
}

export default function PriceTemplateForm({
    onSubmit,
    onCancel,
    mode = "create",
    initialValues,
}: PriceTemplateFormProps) {
    const { facilityOptions } = useFacility();
    const { catalog, isLoading: isCatalogLoading } = useCatalog();

    const [attributeValues, setAttributeValues] = useState<CourtAttributeValues>({
        facilityId: "",
        sportId: "",
        courtTypeId: "",
        surfaceTypeId: "",
    });

    const [attributeErrors, setAttributeErrors] = useState<CourtAttributeErrors>({});

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Store initial snapshot for comparison in edit mode
    const initialSnapshotRef = useRef<PriceTemplateFormValues | null>(null);

    const isViewMode = mode === "view";
    const isEditMode = mode === "edit";

    // Initialize form when initial values are provided (view/edit mode)
    // Store snapshot for change detection in edit mode
    useEffect(() => {
        if (!initialValues) {
            initialSnapshotRef.current = null;
            setSlots([]); // Reset slots when switching to create mode
            return;
        }

        // Create snapshot of initial values for comparison
        initialSnapshotRef.current = {
            facilityId: initialValues.facilityId,
            sportId: initialValues.sportId,
            courtTypeId: initialValues.courtTypeId,
            surfaceTypeId: initialValues.surfaceTypeId,
            name: initialValues.name,
            description: initialValues.description ?? undefined,
            isActive: initialValues.isActive,
            items: [...initialValues.items], // Deep copy for comparison
        };

        setAttributeValues({
            facilityId: initialValues.facilityId !== null ? initialValues.facilityId.toString() : "",
            sportId: initialValues.sportId !== null ? initialValues.sportId.toString() : "",
            courtTypeId: initialValues.courtTypeId !== null ? initialValues.courtTypeId.toString() : "",
            surfaceTypeId:
                initialValues.surfaceTypeId !== null ? initialValues.surfaceTypeId.toString() : "",
        });

        setName(initialValues.name);
        setDescription(initialValues.description ?? "");
        setIsActive(initialValues.isActive);

        // Initialize slots from initial values items
        if (initialValues.items && initialValues.items.length > 0) {
            const initialSlots: TimeSlot[] = initialValues.items.map((item, index) => ({
                id: `initial-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                startTime: normalizeTimeString(item.startTime),
                endTime: normalizeTimeString(item.endTime),
                price: item.price.toString(),
            }));
            setSlots(initialSlots);
        } else {
            setSlots([]);
        }
    }, [initialValues]);

    const handleAttributeChange = (field: keyof CourtAttributeValues, value: string) => {
        if (isViewMode) return;

        setAttributeValues((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Court attributes are optional now, so we don't maintain field-level errors
        setAttributeErrors({});
    };

    // Compare current values with initial snapshot to detect changes
    const hasChanges = (current: PriceTemplateFormValues, initial: PriceTemplateFormValues | null): boolean => {
        if (!initial) return true; // No initial snapshot means create mode, always has "changes"

        // Compare basic fields
        if (
            current.facilityId !== initial.facilityId ||
            current.sportId !== initial.sportId ||
            current.courtTypeId !== initial.courtTypeId ||
            current.surfaceTypeId !== initial.surfaceTypeId ||
            current.name !== initial.name ||
            (current.description ?? null) !== (initial.description ?? null) ||
            current.isActive !== initial.isActive
        ) {
            return true;
        }

        // Compare items array
        if (current.items.length !== initial.items.length) {
            return true;
        }

        // Deep compare items (sort by startTime for consistent comparison)
        const currentItems = [...current.items].sort((a, b) => a.startTime.localeCompare(b.startTime));
        const initialItems = [...initial.items].sort((a, b) => a.startTime.localeCompare(b.startTime));

        for (let i = 0; i < currentItems.length; i++) {
            const currentItem = currentItems[i];
            const initialItem = initialItems[i];

            if (
                currentItem.startTime !== initialItem.startTime ||
                currentItem.endTime !== initialItem.endTime ||
                currentItem.price !== initialItem.price
            ) {
                return true;
            }
        }

        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isViewMode) {
            return;
        }

        if (!name.trim()) {
            alert("Vui lòng nhập tên bảng giá");
            return;
        }

        const validSlots = slots.filter(
            (slot) =>
                slot.startTime &&
                slot.endTime &&
                slot.price &&
                !Number.isNaN(Number(slot.price)) &&
                Number(slot.price) > 0
        );

        if (validSlots.length === 0) {
            alert("Vui lòng thêm ít nhất một khung giờ giá hợp lệ");
            return;
        }

        try {
            setIsSubmitting(true);

            const payload: PriceTemplateFormValues = {
                facilityId: attributeValues.facilityId ? Number(attributeValues.facilityId) : null,
                sportId: attributeValues.sportId ? Number(attributeValues.sportId) : null,
                courtTypeId: attributeValues.courtTypeId ? Number(attributeValues.courtTypeId) : null,
                surfaceTypeId: attributeValues.surfaceTypeId ? Number(attributeValues.surfaceTypeId) : null,
                name: name.trim(),
                description: description.trim() || undefined,
                isActive,
                items: validSlots.map((slot) => ({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    price: Number(slot.price),
                })),
            };

            // In edit mode, check if there are changes before submitting
            if (isEditMode && initialSnapshotRef.current) {
                if (!hasChanges(payload, initialSnapshotRef.current)) {
                    // No changes detected, skip API call
                    alert("Không có thay đổi nào để cập nhật");
                    setIsSubmitting(false);
                    return;
                }
            }

            if (onSubmit) {
                onSubmit(payload);
            } else {
                // Fallback debug log
                console.log("PriceTemplateForm submit payload:", payload);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        if (isViewMode) {
            e.preventDefault();
            return;
        }

        void handleSubmit(e);
    };

    return (
        <form className={styles.form} onSubmit={handleFormSubmit}>
            <CourtAttributeSection
                facilities={facilityOptions}
                catalog={catalog}
                values={attributeValues}
                onChange={isViewMode ? () => {} : handleAttributeChange}
                errors={attributeErrors}
                isLoading={{ catalog: isCatalogLoading }}
                required={{
                    facility: false,
                    sport: false,
                    courtType: false,
                    surfaceType: false,
                }}
                disabled={
                    isViewMode
                        ? {
                              facility: true,
                              sport: true,
                              courtType: true,
                              surfaceType: true,
                          }
                        : undefined
                }
            />

            <div className={styles.formGroup}>
                <label htmlFor="templateName" className={styles.label}>
                    Tên bảng giá <span className={styles.required}>*</span>
                </label>
                <TextField
                    name="templateName"
                    placeholder="Nhập tên bảng giá"
                    value={name}
                    onChange={setName}
                    disabled={isViewMode}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="templateDescription" className={styles.label}>
                    Mô tả
                </label>
                <textarea
                    id="templateDescription"
                    name="templateDescription"
                    placeholder="Nhập mô tả bảng giá (tùy chọn)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.textarea}
                    rows={4}
                    disabled={isViewMode}
                />
            </div>

            <div className={styles.formGroup}>
                <div className={styles.toggleGroup}>
                    <label htmlFor="templateIsActive" className={styles.toggleLabel}>
                        Kích hoạt bảng giá
                    </label>
                    <div className={styles.toggleWrapper}>
                        <input
                            type="checkbox"
                            id="templateIsActive"
                            name="templateIsActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className={styles.toggleCheckbox}
                            disabled={isViewMode}
                        />
                        <label htmlFor="templateIsActive" className={styles.toggleSwitch}>
                            <span className={styles.toggleSlider}></span>
                        </label>
                    </div>
                </div>
                <p className={styles.toggleHelpText}>
                    {isActive
                        ? "Bảng giá này sẽ được sử dụng khi tạo sân mới"
                        : "Bảng giá này sẽ không được sử dụng khi tạo sân mới"}
                </p>
            </div>

            <div className={styles.formGroup}>
                <PriceTableSection
                    priceTemplates={[]}
                    minTime={0}
                    maxTime={24}
                    hideTemplateSelect
                    onSlotsChange={isViewMode ? undefined : setSlots}
                    disabled={isViewMode}
                    initialSlots={initialValues?.items}
                />
            </div>

            <div className={styles.formActions}>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className={styles.cancelButton}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </button>
                )}

                {!isViewMode && (
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? isEditMode
                                ? "Đang cập nhật..."
                                : "Đang lưu..."
                            : isEditMode
                            ? "Cập nhật bảng giá"
                            : "Lưu bảng giá"}
                    </button>
                )}
            </div>
        </form>
    );
}
