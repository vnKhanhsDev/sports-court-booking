import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { priceTemplateService } from "../../../services/priceTemplateService";
import useApi from "@/hooks/useApi";
import type { PriceTemplateOption, PriceTemplateItem } from "../../../types/price.types";
import { normalizeTimeString, type TimeSlot } from "./priceTable.utils";

export interface UsePriceTableProps {
    priceTemplates?: PriceTemplateOption[];
    facilityId?: string;
    sportId?: string;
    initialTemplateId?: number | null;
    initialSlots?: Array<{ startTime: string; endTime: string; price: number }>;
    onTemplateChange?: (templateId: number | null) => void;
    onSlotsChange?: (slots: TimeSlot[]) => void;
}

export interface UsePriceTableReturn {
    selectedTemplateId: string;
    slots: TimeSlot[];
    isLoadingTemplate: boolean;
    filteredTemplates: PriceTemplateOption[];
    handleTemplateChange: (templateId: string) => void;
    handleSlotsChange: (newSlots: TimeSlot[]) => void;
}

export default function usePriceTable({
    priceTemplates = [],
    facilityId,
    sportId,
    initialTemplateId,
    initialSlots,
    onTemplateChange,
    onSlotsChange,
}: UsePriceTableProps): UsePriceTableReturn {
    const { execute: executeGetTemplate } = useApi();
    
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
        initialTemplateId ? initialTemplateId.toString() : ""
    );
    const [currentSlots, setCurrentSlots] = useState<TimeSlot[]>([]);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
    const isInitialized = useRef(false);

    const filteredTemplates = useMemo(() => {
        const facilityIdNum = facilityId ? parseInt(facilityId) : null;
        const sportIdNum = sportId ? parseInt(sportId) : null;

        return priceTemplates.filter((template) => {
            const facilityOk =
                template.facilityId === null ||
                facilityIdNum === null ||
                template.facilityId === facilityIdNum;

            const sportOk =
                template.sportId === null ||
                sportIdNum === null ||
                template.sportId === sportIdNum;

            // No court type / surface type filters provided from caller, so keep null-friendly pass-through
            const courtTypeOk = true;
            const surfaceTypeOk = true;

            return facilityOk && sportOk && courtTypeOk && surfaceTypeOk;
        });
    }, [priceTemplates, facilityId, sportId]);

    useEffect(() => {
        // Initialize raw slots only once and only when no template is preselected
        if (!isInitialized.current && !selectedTemplateId && initialSlots) {
            if (initialSlots.length > 0) {
                const slots: TimeSlot[] = initialSlots.map((slot, index) => ({
                    id: `initial-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    startTime: normalizeTimeString(slot.startTime),
                    endTime: normalizeTimeString(slot.endTime),
                    price: slot.price.toString(),
                }));
                setCurrentSlots(slots);
            }
            isInitialized.current = true;
        }
    }, [initialSlots, selectedTemplateId]);

    useEffect(() => {
        // If an initial template is provided, load it once on mount
        if (selectedTemplateId && currentSlots.length === 0) {
            handleTemplateChange(selectedTemplateId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleTemplateChange = useCallback(async (templateId: string) => {
        setSelectedTemplateId(templateId);
        if (onTemplateChange) {
            onTemplateChange(templateId ? parseInt(templateId) : null);
        }

        if (!templateId) {
            return;
        }

        setIsLoadingTemplate(true);
        try {
            const items = await executeGetTemplate(() =>
                priceTemplateService.getPriceTemplateItemsById(parseInt(templateId))
            ) as PriceTemplateItem[] | null;

            if (items && items.length > 0) {
                const newSlots: TimeSlot[] = items.map((item, index) => ({
                    id: `template-${templateId}-${index}-${Math.random().toString(36).slice(2, 9)}`,
                    startTime: normalizeTimeString(item.startTime),
                    endTime: normalizeTimeString(item.endTime),
                    price: item.price.toString(),
                }));
                setCurrentSlots(newSlots);
                if (onSlotsChange) {
                    onSlotsChange(newSlots);
                }
            } else {
                setCurrentSlots([]);
                if (onSlotsChange) {
                    onSlotsChange([]);
                }
            }
        } catch (error) {
            console.error("Failed to load price template items:", error);
            setCurrentSlots([]);
            if (onSlotsChange) {
                onSlotsChange([]);
            }
        } finally {
            setIsLoadingTemplate(false);
        }
    }, [executeGetTemplate, onSlotsChange, onTemplateChange]);

    const handleSlotsChange = useCallback((newSlots: TimeSlot[]) => {
        setCurrentSlots(newSlots);
        if (selectedTemplateId) {
            setSelectedTemplateId("");
            if (onTemplateChange) {
                onTemplateChange(null);
            }
        }
        if (onSlotsChange) {
            onSlotsChange(newSlots);
        }
    }, [onSlotsChange, onTemplateChange, selectedTemplateId]);

    return {
        selectedTemplateId,
        slots: currentSlots,
        isLoadingTemplate,
        filteredTemplates,
        handleTemplateChange,
        handleSlotsChange,
    };
}
