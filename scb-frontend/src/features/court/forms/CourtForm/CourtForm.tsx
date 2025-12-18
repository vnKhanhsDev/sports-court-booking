import { useState } from "react";
import type { OwnerFacilitySummary } from "../../types/facility.types";
import useCatalog from "@/hooks/useCatalog";
import ImageUpload from "@/components/form/ImageUpload/ImageUpload";
import { TextField } from "@/components/form";
import { uploadImage } from "@/services/uploadService";
import { courtServiceForOwner } from "../../services/courtService";
import useApi from "@/hooks/useApi";
import PriceTableSection from "../../components/form/PriceTableSection/PriceTableSection";
import type { TimeSlot } from "../../components/form/PriceTableSection/priceTable.utils";
import CourtAttributeSection, { type CourtAttributeValues } from "../../components/form/CourtAttributeSection/CourtAttributeSection";
import styles from "./CourtForm.module.css";
import type { PriceTemplateOption } from "../../types/price.types";

interface CourtFormProps {
    facilities: OwnerFacilitySummary[];
    priceTemplates: PriceTemplateOption[];
    onSubmit?: (courtId: number) => void;
    onCancel?: () => void;
}

export default function CourtForm({ facilities, priceTemplates, onSubmit, onCancel }: CourtFormProps) {
    const { catalog, isLoading: isCatalogLoading } = useCatalog();
    // const { priceTemplates } = usePriceTemplateForOwner();
    const { execute: executeCreateCourt, isLoading: isSubmitting } = useApi();
    
    const [attributeValues, setAttributeValues] = useState<CourtAttributeValues>({
        facilityId: "",
        sportId: "",
        courtTypeId: "",
        surfaceTypeId: "",
    });
    const [courtName, setCourtName] = useState<string>("");
    const [selectedPriceTemplateId, setSelectedPriceTemplateId] = useState<number | null>(null);
    const [currentPriceSlots, setCurrentPriceSlots] = useState<TimeSlot[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const selectedFacility = facilities.find(facility => facility.id.toString() === attributeValues.facilityId);

    // Parse opening and closing times to hours (e.g., "05:00" -> 5, "22:00" -> 22)
    const parseTimeToHour = (timeString: string): number => {
        if (!timeString) return 0;
        const [hours] = timeString.split(':');
        return parseInt(hours, 10);
    };

    const minTime = selectedFacility ? parseTimeToHour(selectedFacility.openingTime) : 0;
    const maxTime = selectedFacility ? parseTimeToHour(selectedFacility.closingTime) : 24;

    const handleAttributeChange = (field: keyof CourtAttributeValues, value: string) => {
        setAttributeValues(prev => {
            const newValues = { ...prev, [field]: value };
            
            // Reset price template when facility or sport changes
            if (field === "facilityId" || field === "sportId") {
                setSelectedPriceTemplateId(null);
                setCurrentPriceSlots([]);
            }
            
            return newValues;
        });
    };

    const handleUpload = async (file: File): Promise<string> => {
        return await uploadImage(file, "courts");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!attributeValues.facilityId || !attributeValues.sportId || 
            !attributeValues.courtTypeId || !attributeValues.surfaceTypeId) {
            alert("Vui lòng điền đầy đủ thông tin cơ sở, môn thể thao, loại sân và loại mặt sân");
            return;
        }

        if (!courtName.trim()) {
            alert("Vui lòng nhập tên sân");
            return;
        }

        // Validate price table - must have at least one valid slot if no template
        if (!selectedPriceTemplateId) {
            if (currentPriceSlots.length === 0) {
                alert("Vui lòng thêm ít nhất một khung giờ giá hoặc chọn bảng giá mẫu");
                return;
            }
            
            // Validate that all slots have valid data
            const validSlots = currentPriceSlots.filter(slot => 
                slot.startTime && slot.endTime && slot.price && 
                parseFloat(slot.price) > 0
            );
            
            if (validSlots.length === 0) {
                alert("Vui lòng nhập đầy đủ thông tin cho các khung giờ giá (thời gian bắt đầu, kết thúc và giá)");
                return;
            }
        }

        try {
            const priceItems = selectedPriceTemplateId ? undefined : currentPriceSlots
                .filter(slot => slot.startTime && slot.endTime && slot.price && parseFloat(slot.price) > 0)
                .map(slot => ({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    price: parseFloat(slot.price),
                }));

            const courtId = await executeCreateCourt(() =>
                courtServiceForOwner.createCourt({
                    facilityId: parseInt(attributeValues.facilityId!),
                    sportId: parseInt(attributeValues.sportId!),
                    courtTypeId: parseInt(attributeValues.courtTypeId!),
                    surfaceTypeId: parseInt(attributeValues.surfaceTypeId!),
                    name: courtName.trim(),
                    priceTemplateId: selectedPriceTemplateId || undefined,
                    priceItems: priceItems && priceItems.length > 0 ? priceItems : undefined,
                    imageUrls: images.length > 0 ? images : undefined,
                })
            ) as number;

            // Reset form after successful submission
            setAttributeValues({
                facilityId: "",
                sportId: "",
                courtTypeId: "",
                surfaceTypeId: "",
            });
            setCourtName("");
            setSelectedPriceTemplateId(null);
            setImages([]);
            setCurrentPriceSlots([]);

            if (onSubmit) {
                onSubmit(courtId);
            }
        } catch (error: any) {
            console.error("Failed to create court:", error);
            alert(error?.message || "Có lỗi xảy ra khi tạo sân. Vui lòng thử lại.");
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <CourtAttributeSection
                facilities={facilities}
                catalog={catalog}
                values={attributeValues}
                onChange={handleAttributeChange}
                isLoading={{ catalog: isCatalogLoading }}
            />

            <div className={styles.secondRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="courtName" className={styles.label}>
                        Tên sân <span className={styles.required}>*</span>
                    </label>
                    <TextField
                        name="courtName"
                        placeholder="Nhập tên sân"
                        value={courtName}
                        onChange={setCourtName}
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <PriceTableSection
                    priceTemplates={priceTemplates}
                    facilityId={attributeValues.facilityId}
                    sportId={attributeValues.sportId}
                    minTime={minTime}
                    maxTime={maxTime}
                    onTemplateChange={setSelectedPriceTemplateId}
                    onSlotsChange={setCurrentPriceSlots}
                    disabled={false}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Hình ảnh sân
                </label>
                <ImageUpload
                    multiple
                    value={images}
                    onChange={(newValue) => setImages(newValue as string[])}
                    onUpload={handleUpload}
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
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang tạo..." : "Tạo sân"}
                </button>
            </div>
        </form>
    );
}
