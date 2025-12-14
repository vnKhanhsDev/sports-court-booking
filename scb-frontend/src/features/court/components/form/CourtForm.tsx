import { useState, useEffect, useMemo } from "react";
import type { FacilityBasicForOwner } from "../../types/facility.types";
import type { PriceTemplateItem } from "../../types/price.types";
import useCatalog from "@/hooks/useCatalog";
import usePriceTemplateForOwner from "../../hooks/usePriceTemplateForOwner";
import ImageUpload from "@/components/form/ImageUpload/ImageUpload";
import { uploadImage } from "@/services/uploadService";
import { courtServiceForOwner } from "../../services/courtService";
import useApi from "@/hooks/useApi";
import PriceTable from "../shared/PriceTable";
import type { TimeSlot } from "../shared/PriceTable";
import styles from "./CourtForm.module.css";

interface CourtFormProps {
    facilities: FacilityBasicForOwner[];
}

export default function CourtForm({ facilities }: CourtFormProps) {
    const { catalog, isLoading: isCatalogLoading } = useCatalog();
    const { priceTemplates, isLoading: isPriceTemplatesLoading } = usePriceTemplateForOwner();
    const { execute: executeGetTemplate } = useApi();
    
    const [selectedFacilityId, setSelectedFacilityId] = useState<string>("");
    const [selectedSportId, setSelectedSportId] = useState<string>("");
    const [selectedCourtTypeId, setSelectedCourtTypeId] = useState<string>("");
    const [selectedSurfaceTypeId, setSelectedSurfaceTypeId] = useState<string>("");
    const [selectedPriceTemplateId, setSelectedPriceTemplateId] = useState<string>("");
    const [images, setImages] = useState<string[]>([]);
    const [initialPriceSlots, setInitialPriceSlots] = useState<Array<{ startTime: string; endTime: string; price: number }> | undefined>(undefined);
    const [isPriceTableEdited, setIsPriceTableEdited] = useState(false);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

    const selectedSport = catalog.find(sport => sport.id.toString() === selectedSportId);
    const selectedFacility = facilities.find(facility => facility.id.toString() === selectedFacilityId);

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
        if (!selectedFacilityId || !selectedSportId) {
            return [];
        }
        return priceTemplates.filter(template => {
            const matchesFacility = !template.facilityName || 
                template.facilityName === selectedFacility?.name;
            const matchesSport = !template.sportName || 
                template.sportName === selectedSport?.name;
            return matchesFacility && matchesSport && template.isActive;
        });
    }, [priceTemplates, selectedFacilityId, selectedSportId, selectedFacility, selectedSport]);

    // Load price template when selected
    useEffect(() => {
        const loadPriceTemplate = async () => {
            if (!selectedPriceTemplateId) {
                setInitialPriceSlots(undefined);
                return;
            }

            if (isPriceTableEdited) {
                return; // Don't reload if user has edited
            }

            setIsLoadingTemplate(true);
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
                    setIsPriceTableEdited(false);
                } else {
                    setInitialPriceSlots(undefined);
                }
            } catch (error) {
                console.error("Failed to load price template:", error);
                setInitialPriceSlots(undefined);
            } finally {
                setIsLoadingTemplate(false);
            }
        };

        loadPriceTemplate();
    }, [selectedPriceTemplateId, executeGetTemplate, isPriceTableEdited]);

    // Reset price template selection when price table is edited
    const handlePriceTableChange = (slots: TimeSlot[]) => {
        if (!isPriceTableEdited && selectedPriceTemplateId && slots.length > 0) {
            // Check if slots have been modified from initial template
            const hasChanges = initialPriceSlots ? 
                slots.length !== initialPriceSlots.length ||
                slots.some((slot, index) => {
                    const initialSlot = initialPriceSlots[index];
                    if (!initialSlot) return true;
                    return slot.startTime !== initialSlot.startTime ||
                           slot.endTime !== initialSlot.endTime ||
                           parseFloat(slot.price) !== initialSlot.price;
                }) : true;
            
            if (hasChanges) {
                setIsPriceTableEdited(true);
                setSelectedPriceTemplateId(""); // Reset to default/custom pricing
            }
        }
    };

    const handlePriceTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const templateId = e.target.value;
        setSelectedPriceTemplateId(templateId);
        setIsPriceTableEdited(false);
        setInitialPriceSlots(undefined); // Clear previous slots
        // The useEffect will handle loading the template
    };

    const handleFacilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFacilityId(e.target.value);
        // Reset price template when facility changes
        setSelectedPriceTemplateId("");
        setInitialPriceSlots(undefined);
        setIsPriceTableEdited(false);
    };

    const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSportId(e.target.value);
        // Reset dependent selects when sport changes
        setSelectedCourtTypeId("");
        setSelectedSurfaceTypeId("");
        // Reset price template when sport changes
        setSelectedPriceTemplateId("");
        setInitialPriceSlots(undefined);
        setIsPriceTableEdited(false);
    };

    const handleCourtTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCourtTypeId(e.target.value);
    };

    const handleSurfaceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSurfaceTypeId(e.target.value);
    };

    const handleUpload = async (file: File): Promise<string> => {
        return await uploadImage(file);
    };

    return (
        <div className={styles.form}>
            <div className={styles.formGroup}>
                <label htmlFor="facility" className={styles.label}>
                    Cơ sở <span className={styles.required}>*</span>
                </label>
                <select
                    id="facility"
                    value={selectedFacilityId}
                    onChange={handleFacilityChange}
                    className={styles.select}
                    required
                >
                    <option value="">-- Chọn cơ sở --</option>
                    {facilities.map((facility) => (
                        <option key={facility.id} value={facility.id}>
                            {facility.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.catalogRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="sport" className={styles.label}>
                        Môn thể thao <span className={styles.required}>*</span>
                    </label>
                    <select
                        id="sport"
                        value={selectedSportId}
                        onChange={handleSportChange}
                        className={styles.select}
                        required
                        disabled={isCatalogLoading}
                    >
                        <option value="">-- Chọn môn thể thao --</option>
                        {catalog.map((sport) => (
                            <option key={sport.id} value={sport.id}>
                                {sport.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="courtType" className={styles.label}>
                        Loại sân <span className={styles.required}>*</span>
                    </label>
                    <select
                        id="courtType"
                        value={selectedCourtTypeId}
                        onChange={handleCourtTypeChange}
                        className={styles.select}
                        required
                        disabled={!selectedSportId}
                    >
                        <option value="">-- Chọn loại sân --</option>
                        {selectedSport?.courtTypes.map((courtType) => (
                            <option key={courtType.id} value={courtType.id}>
                                {courtType.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="surfaceType" className={styles.label}>
                        Loại mặt sân <span className={styles.required}>*</span>
                    </label>
                    <select
                        id="surfaceType"
                        value={selectedSurfaceTypeId}
                        onChange={handleSurfaceTypeChange}
                        className={styles.select}
                        required
                        disabled={!selectedSportId}
                    >
                        <option value="">-- Chọn loại mặt sân --</option>
                        {selectedSport?.surfaceTypes.map((surfaceType) => (
                            <option key={surfaceType.id} value={surfaceType.id}>
                                {surfaceType.name}
                            </option>
                        ))}
                    </select>
                </div>
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

            {selectedFacility && (
                <>
                    <div className={styles.formGroup}>
                        <label htmlFor="priceTemplate" className={styles.label}>
                            Bảng giá mẫu (tùy chọn)
                        </label>
                        <select
                            id="priceTemplate"
                            value={selectedPriceTemplateId}
                            onChange={handlePriceTemplateChange}
                            className={styles.select}
                            disabled={!selectedFacilityId || !selectedSportId || isPriceTemplatesLoading || isLoadingTemplate}
                        >
                            <option value="">-- Chọn bảng giá mẫu hoặc tự nhập --</option>
                            {filteredPriceTemplates.map((template) => (
                                <option key={template.id} value={template.id}>
                                    {template.name} {template.version > 1 ? `(v${template.version})` : ''}
                                </option>
                            ))}
                        </select>
                        {isPriceTableEdited && selectedPriceTemplateId === "" && (
                            <p className={styles.hint}>
                                Bạn đang sử dụng bảng giá tùy chỉnh
                            </p>
                        )}
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
                </>
            )}
        </div>
    );
}
