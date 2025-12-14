import { useState, useEffect, useMemo } from "react";
import type { FacilityBasicForOwner } from "../../types/facility.types";
import useCatalog from "@/hooks/useCatalog";
import usePriceTemplateForOwner from "../../hooks/usePriceTemplateForOwner";
import ImageUpload from "@/components/form/ImageUpload/ImageUpload";
import { TextField } from "@/components/form";
import { Select } from "@/components/form";
import { uploadImage } from "@/services/uploadService";
import { courtServiceForOwner } from "../../services/courtService";
import useApi from "@/hooks/useApi";
import PriceTable, { type TimeSlot } from "../shared/PriceTable";
import CourtAttributeSelects, { type CourtAttributeSelectsValues } from "../shared/CourtAttributeSelects";
import styles from "./CourtForm.module.css";

interface CourtFormProps {
    facilities: FacilityBasicForOwner[];
    onSubmit?: (courtId: number) => void;
    onCancel?: () => void;
}

export default function CourtForm({ facilities, onSubmit, onCancel }: CourtFormProps) {
    const { catalog, isLoading: isCatalogLoading } = useCatalog();
    const { priceTemplates, isLoading: isPriceTemplatesLoading } = usePriceTemplateForOwner();
    const { execute: executeGetTemplate } = useApi();
    const { execute: executeCreateCourt, isLoading: isSubmitting } = useApi();
    
    const [attributeValues, setAttributeValues] = useState<CourtAttributeSelectsValues>({
        facilityId: "",
        sportId: "",
        courtTypeId: "",
        surfaceTypeId: "",
    });
    const [courtName, setCourtName] = useState<string>("");
    const [selectedPriceTemplateId, setSelectedPriceTemplateId] = useState<string>("");
    const [images, setImages] = useState<string[]>([]);
    const [currentPriceSlots, setCurrentPriceSlots] = useState<TimeSlot[]>([]);
    const [initialPriceSlots, setInitialPriceSlots] = useState<Array<{ startTime: string; endTime: string; price: number }> | undefined>(undefined);
    const [templateSlotsSnapshot, setTemplateSlotsSnapshot] = useState<Array<{ startTime: string; endTime: string; price: number }> | null>(null);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
    const [isTemplateLoading, setIsTemplateLoading] = useState(false);

    const selectedSport = catalog.find(sport => sport.id.toString() === attributeValues.sportId);
    const selectedFacility = facilities.find(facility => facility.id.toString() === attributeValues.facilityId);

    // Parse opening and closing times to hours (e.g., "05:00" -> 5, "22:00" -> 22)
    const parseTimeToHour = (timeString: string): number => {
        if (!timeString) return 0;
        const [hours] = timeString.split(':');
        return parseInt(hours, 10);
    };

    const minTime = selectedFacility ? parseTimeToHour(selectedFacility.openingTime) : 0;
    const maxTime = selectedFacility ? parseTimeToHour(selectedFacility.closingTime) : 24;

    // Filter price templates based on selected facility and sport
    const filteredPriceTemplates = useMemo(() => {
        if (!attributeValues.facilityId || !attributeValues.sportId) {
            return [];
        }
        return priceTemplates.filter(template => {
            const matchesFacility = !template.facilityName || 
                template.facilityName === selectedFacility?.name;
            const matchesSport = !template.sportName || 
                template.sportName === selectedSport?.name;
            return matchesFacility && matchesSport && template.isActive;
        });
    }, [priceTemplates, attributeValues.facilityId, attributeValues.sportId, selectedFacility, selectedSport]);

    // Load price template when selected
    useEffect(() => {
        const loadPriceTemplate = async () => {
            if (!selectedPriceTemplateId) {
                setInitialPriceSlots(undefined);
                setTemplateSlotsSnapshot(null);
                setIsTemplateLoading(false);
                return;
            }

            setIsLoadingTemplate(true);
            setIsTemplateLoading(true);
            try {
                const template = await executeGetTemplate(() => 
                    courtServiceForOwner.getPriceTemplateById(parseInt(selectedPriceTemplateId))
                ) as import("../../types/price.types").PriceTemplateDetail | null;
                
                if (template?.items) {
                    const initialSlots: Array<{ startTime: string; endTime: string; price: number }> = 
                        template.items.map((item) => ({
                            startTime: item.startTime,
                            endTime: item.endTime,
                            price: item.price,
                        }));
                    setInitialPriceSlots(initialSlots);
                    // Store snapshot for comparison
                    setTemplateSlotsSnapshot(initialSlots);
                } else {
                    setInitialPriceSlots(undefined);
                    setTemplateSlotsSnapshot(null);
                }
            } catch (error) {
                console.error("Failed to load price template:", error);
                setInitialPriceSlots(undefined);
                setTemplateSlotsSnapshot(null);
            } finally {
                setIsLoadingTemplate(false);
                // Delay resetting isTemplateLoading to allow PriceTable to update
                setTimeout(() => setIsTemplateLoading(false), 100);
            }
        };

        loadPriceTemplate();
    }, [selectedPriceTemplateId, executeGetTemplate]);

    const handlePriceTemplateChange = (value: string) => {
        setSelectedPriceTemplateId(value);
        // The useEffect will handle loading the template
    };

    const handlePriceTableChange = (slots: TimeSlot[]) => {
        setCurrentPriceSlots(slots);
        
        // Don't check for changes while template is loading (to prevent false positives)
        if (isTemplateLoading) {
            return;
        }
        
        // If a template is selected, check if user has edited the table
        if (selectedPriceTemplateId && templateSlotsSnapshot) {
            // Compare current slots with template snapshot
            const hasChanges = 
                slots.length !== templateSlotsSnapshot.length ||
                slots.some((slot, index) => {
                    const templateSlot = templateSlotsSnapshot[index];
                    if (!templateSlot) return true;
                    return slot.startTime !== templateSlot.startTime ||
                           slot.endTime !== templateSlot.endTime ||
                           parseFloat(slot.price) !== templateSlot.price;
                });
            
            // If user edited, reset template selection to default
            if (hasChanges) {
                setSelectedPriceTemplateId("");
                setTemplateSlotsSnapshot(null);
            }
        }
    };

    const handleAttributeChange = (field: keyof CourtAttributeSelectsValues, value: string) => {
        setAttributeValues(prev => {
            const newValues = { ...prev, [field]: value };
            
            // Reset price template when facility or sport changes
            if (field === "facilityId" || field === "sportId") {
                setSelectedPriceTemplateId("");
                setInitialPriceSlots(undefined);
                setTemplateSlotsSnapshot(null);
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

            const priceTemplateIdValue = selectedPriceTemplateId && selectedPriceTemplateId.trim() !== "" 
                ? parseInt(selectedPriceTemplateId) 
                : undefined;
            
            // Validate priceTemplateId if provided
            if (priceTemplateIdValue !== undefined && isNaN(priceTemplateIdValue)) {
                alert("Bảng giá mẫu không hợp lệ. Vui lòng thử lại.");
                return;
            }

            const courtId = await executeCreateCourt(() =>
                courtServiceForOwner.createCourt({
                    facilityId: parseInt(attributeValues.facilityId!),
                    sportId: parseInt(attributeValues.sportId!),
                    courtTypeId: parseInt(attributeValues.courtTypeId!),
                    surfaceTypeId: parseInt(attributeValues.surfaceTypeId!),
                    name: courtName.trim(),
                    priceTemplateId: priceTemplateIdValue,
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
            setSelectedPriceTemplateId("");
            setImages([]);
            setCurrentPriceSlots([]);
            setInitialPriceSlots(undefined);
            setTemplateSlotsSnapshot(null);

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
            <CourtAttributeSelects
                facilities={facilities}
                catalog={catalog}
                values={attributeValues}
                onChange={handleAttributeChange}
                isLoading={{ catalog: isCatalogLoading }}
                layout="grid"
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

                <div className={styles.formGroup}>
                    <Select
                        label="Bảng giá mẫu (tùy chọn)"
                        placeholder="-- Chọn bảng giá mẫu --"
                        value={selectedPriceTemplateId}
                        onChange={handlePriceTemplateChange}
                        options={filteredPriceTemplates.map((template) => ({
                            value: template.id.toString(),
                            label: `${template.name}${template.version > 1 ? ` (v${template.version})` : ''}`,
                        }))}
                        disabled={!attributeValues.facilityId || !attributeValues.sportId || isPriceTemplatesLoading || isLoadingTemplate}
                        name="priceTemplate"
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Bảng giá theo khung giờ <span className={styles.required}>*</span>
                </label>
                <PriceTable
                    minTime={minTime}
                    maxTime={maxTime}
                    initialSlots={initialPriceSlots}
                    onChange={handlePriceTableChange}
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
