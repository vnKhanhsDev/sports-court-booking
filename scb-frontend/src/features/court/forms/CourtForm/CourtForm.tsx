import { useState, useEffect, useRef, useMemo } from "react";
import type { OwnerFacilitySummary } from "../../types/facility.types";
import useCatalog from "@/hooks/usePublicCatalog";
import ImageUpload from "@/components/form/ImageUpload/ImageUpload";
import { TextField } from "@/components/form";
import { uploadImage } from "@/services/uploadService";
import { courtServiceForOwner } from "../../services/courtService";
import useApi from "@/hooks/useApi";
import PriceTableSection from "../../components/form/PriceTableSection/PriceTableSection";
import type { TimeSlot } from "../../components/form/PriceTableSection/priceTable.utils";
import CourtAttributeSection, { type CourtAttributeValues } from "../../components/form/CourtAttributeSection/CourtAttributeSection";
import styles from "./CourtForm.module.css";
import type { PriceListOption } from "../../types/price.types";
import type { PriceSlot, CourtImage, OwnerCourtDetail } from "../../types/court.types";
import { normalizeTimeString } from "../../components/form/PriceTableSection/priceTable.utils";

interface CourtFormProps {
    facilities: OwnerFacilitySummary[];
    priceLists: PriceListOption[];
    onSubmit?: () => void;
    onCancel?: () => void;
    readOnly?: boolean;
    initialData?: OwnerCourtDetail;
    mode?: "create" | "edit";
    courtId?: number;
}

export default function CourtForm({ 
    facilities, 
    priceLists, 
    onSubmit, 
    onCancel,
    readOnly = false,
    initialData,
    mode = "create",
    courtId
}: CourtFormProps) {
    const { catalog, isLoading: isCatalogLoading } = useCatalog();
    const { execute: executeCourtOperation, isLoading: isSubmitting } = useApi();
    
    const [attributeValues, setAttributeValues] = useState<CourtAttributeValues>({
        facilityId: "",
        sportId: "",
        courtTypeId: "",
        surfaceTypeId: "",
    });
    const [courtName, setCourtName] = useState<string>("");
    const [selectedPriceListId, setSelectedPriceListId] = useState<number | null>(null);
    const [currentPriceSlots, setCurrentPriceSlots] = useState<TimeSlot[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const initialSlotsRef = useRef<Array<{ startTime: string; endTime: string; price: number }> | undefined>(undefined);

    // Initialize form with initialData if provided, or reset if not provided
    useEffect(() => {
        if (initialData) {
            setAttributeValues({
                facilityId: initialData.facilityId.toString(),
                sportId: initialData.sportId.toString(),
                courtTypeId: initialData.courtTypeId.toString(),
                surfaceTypeId: initialData.surfaceTypeId.toString(),
            });
            setCourtName(initialData.name);
            setSelectedPriceListId(initialData.priceListId);

            // Convert PriceSlot[] to TimeSlot[]
            if (initialData.slots && initialData.slots.length > 0) {
                const slots: TimeSlot[] = initialData.slots.map((slot, index) => ({
                    id: `initial-${index}-${Date.now()}`,
                    startTime: normalizeTimeString(slot.fromTime),
                    endTime: normalizeTimeString(slot.toTime),
                    price: slot.price != null && !isNaN(Number(slot.price)) ? slot.price.toString() : "",
                }));
                setCurrentPriceSlots(slots);
                // Store initial slots for PriceTableSection (only on initial load)
                initialSlotsRef.current = slots.map(slot => ({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    price: slot.price && !isNaN(parseFloat(slot.price)) ? parseFloat(slot.price) : 0,
                }));
            } else {
                setCurrentPriceSlots([]);
                initialSlotsRef.current = undefined;
            }

            // Convert CourtImage[] to string[] (for ImageUpload component)
            if (initialData.imageUrls && initialData.imageUrls.length > 0) {
                const imageUrls = initialData.imageUrls
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map(img => img.imageUrl);
                setImages(imageUrls);
            } else {
                setImages([]);
            }
        } else {
            // Reset form when initialData is cleared (e.g., when closing modal)
            setAttributeValues({
                facilityId: "",
                sportId: "",
                courtTypeId: "",
                surfaceTypeId: "",
            });
            setCourtName("");
            setSelectedPriceListId(null);
            setCurrentPriceSlots([]);
            setImages([]);
            initialSlotsRef.current = undefined;
        }
    }, [initialData]);

    // Memoize initialSlots to only pass them on initial load, not on every render
    const initialSlotsForTable = useMemo(() => {
        return initialSlotsRef.current;
    }, [initialData]);

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
        if (readOnly) return; // Prevent changes in read-only mode
        
        setAttributeValues(prev => {
            const newValues = { ...prev, [field]: value };
            
            // Reset price list when facility or sport changes
            if (field === "facilityId" || field === "sportId") {
                setSelectedPriceListId(null);
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

        // Validate price table - must have at least one valid slot if no price list
        if (!selectedPriceListId) {
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
            // Convert TimeSlot[] to PriceSlot[]
            // If price list is selected, slots should be undefined
            // If no price list is selected, slots must be provided (validated above)
            const priceSlots: PriceSlot[] | undefined = selectedPriceListId 
                ? undefined 
                : currentPriceSlots
                    .filter(slot => slot.startTime && slot.endTime && slot.price && parseFloat(slot.price) > 0)
                    .map(slot => ({
                        fromTime: slot.startTime,
                        toTime: slot.endTime,
                        price: parseFloat(slot.price),
                    }));

            // Convert string[] to CourtImage[] with displayOrder
            const courtImages: CourtImage[] | undefined = images.length > 0
                ? images.map((imageUrl, index) => ({
                    imageUrl,
                    displayOrder: index,
                }))
                : undefined;

            // Call create or update based on mode
            if (mode === "edit" && courtId) {
                // Update existing court
                await executeCourtOperation(() =>
                    courtServiceForOwner.updateCourt(courtId, {
                        facilityId: parseInt(attributeValues.facilityId!),
                        sportId: parseInt(attributeValues.sportId!),
                        courtTypeId: parseInt(attributeValues.courtTypeId!),
                        surfaceTypeId: parseInt(attributeValues.surfaceTypeId!),
                        name: courtName.trim(),
                        priceListId: selectedPriceListId || undefined,
                        slots: priceSlots && priceSlots.length > 0 ? priceSlots : undefined,
                        images: courtImages,
                        status: initialData?.status || "PENDING", // Preserve existing status or default
                    })
                );
            } else {
                // Create new court
                await executeCourtOperation(() =>
                    courtServiceForOwner.createCourt({
                        facilityId: parseInt(attributeValues.facilityId!),
                        sportId: parseInt(attributeValues.sportId!),
                        courtTypeId: parseInt(attributeValues.courtTypeId!),
                        surfaceTypeId: parseInt(attributeValues.surfaceTypeId!),
                        name: courtName.trim(),
                        priceListId: selectedPriceListId || undefined,
                        slots: priceSlots && priceSlots.length > 0 ? priceSlots : undefined,
                        images: courtImages,
                    })
                );
            }

            // Reset form after successful submission (only in create mode)
            if (mode === "create") {
                setAttributeValues({
                    facilityId: "",
                    sportId: "",
                    courtTypeId: "",
                    surfaceTypeId: "",
                });
                setCourtName("");
                setSelectedPriceListId(null);
                setImages([]);
                setCurrentPriceSlots([]);
            }

            // Call onSubmit callback to trigger list refresh
            if (onSubmit) {
                onSubmit();
            }
        } catch (error: any) {
            console.error(`Failed to ${mode === "edit" ? "update" : "create"} court:`, error);
            alert(error?.message || `Có lỗi xảy ra khi ${mode === "edit" ? "cập nhật" : "tạo"} sân. Vui lòng thử lại.`);
        }
    };

    return (
        <form className={styles.form} onSubmit={readOnly ? (e) => e.preventDefault() : handleSubmit}>
            <CourtAttributeSection
                facilities={facilities}
                catalog={catalog}
                values={attributeValues}
                onChange={handleAttributeChange}
                isLoading={{ catalog: isCatalogLoading }}
                disabled={readOnly ? {
                    facility: true,
                    sport: true,
                    courtType: true,
                    surfaceType: true,
                } : undefined}
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
                        onChange={readOnly ? () => {} : setCourtName}
                        disabled={readOnly}
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <PriceTableSection
                    priceLists={priceLists}
                    facilityId={attributeValues.facilityId}
                    sportId={attributeValues.sportId}
                    minTime={minTime}
                    maxTime={maxTime}
                    initialPriceListId={selectedPriceListId}
                    initialSlots={initialSlotsForTable}
                    onPriceListChange={readOnly ? undefined : setSelectedPriceListId}
                    onSlotsChange={readOnly ? undefined : setCurrentPriceSlots}
                    disabled={readOnly}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Hình ảnh sân
                </label>
                {readOnly ? (
                    <div className={styles.imagePreview}>
                        {images.length > 0 ? (
                            <div className={styles.imageGrid}>
                                {images.map((imageUrl, index) => (
                                    <img
                                        key={index}
                                        src={imageUrl}
                                        alt={`Court image ${index + 1}`}
                                        className={styles.previewImage}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className={styles.noImages}>Không có hình ảnh</p>
                        )}
                    </div>
                ) : (
                    <ImageUpload
                        multiple
                        value={images}
                        onChange={(newValue) => setImages(newValue as string[])}
                        onUpload={handleUpload}
                    />
                )}
            </div>

            {!readOnly && (
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
                        {isSubmitting 
                        ? (mode === "edit" ? "Đang cập nhật..." : "Đang tạo...") 
                        : (mode === "edit" ? "Cập nhật sân" : "Tạo sân")}
                    </button>
                </div>
            )}
        </form>
    );
}
