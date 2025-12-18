import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { priceTemplateService } from "../../../services/priceTemplateService";
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
    
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
        initialTemplateId ? initialTemplateId.toString() : ""
    );
    
    const [currentSlots, setCurrentSlots] = useState<TimeSlot[]>([]);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
    const previousInitialTemplateId = useRef<number | null | undefined>(undefined);
    const previousInitialSlots = useRef<Array<{ startTime: string; endTime: string; price: number }> | undefined>(undefined);
    const isManualTemplateChange = useRef(false);

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

    // Function to load template items
    const loadTemplateItems = useCallback(async (templateId: number, isManual = false) => {
        setIsLoadingTemplate(true);
        try {
            // Call the service directly instead of using useApi's execute
            const items = await priceTemplateService.getPriceTemplateItemsById(templateId);

            console.log("Loaded template items:", items, "for template ID:", templateId);

            if (items && items.length > 0) {
                const newSlots: TimeSlot[] = items.map((item, index) => ({
                    id: `template-${templateId}-${index}-${Math.random().toString(36).slice(2, 9)}`,
                    startTime: normalizeTimeString(item.startTime),
                    endTime: normalizeTimeString(item.endTime),
                    price: item.price.toString(),
                }));
                console.log("Created slots from template items:", newSlots);
                setCurrentSlots(newSlots);
                if (onSlotsChange) {
                    onSlotsChange(newSlots);
                }
            } else {
                console.warn("No items found for template ID:", templateId);
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
            // Reset manual flag after loading completes
            if (isManual) {
                // Use setTimeout to ensure state updates are processed first
                setTimeout(() => {
                    isManualTemplateChange.current = false;
                }, 0);
            }
        }
    }, [onSlotsChange]);

    // Sync selectedTemplateId with initialTemplateId prop changes
    useEffect(() => {
        const newTemplateId = initialTemplateId ? initialTemplateId.toString() : "";
        if (newTemplateId !== selectedTemplateId) {
            setSelectedTemplateId(newTemplateId);
        }
    }, [initialTemplateId, selectedTemplateId]);

    // Handle initial template loading or initial slots
    useEffect(() => {
        // Don't interfere with manual template changes - let the async operation complete first
        if (isManualTemplateChange.current) {
            return;
        }

        const templateIdChanged = previousInitialTemplateId.current !== initialTemplateId;
        // Compare slots properly - handle undefined/null cases
        const previousSlotsStr = previousInitialSlots.current ? JSON.stringify(previousInitialSlots.current) : null;
        const currentSlotsStr = initialSlots ? JSON.stringify(initialSlots) : null;
        const slotsChanged = previousSlotsStr !== currentSlotsStr;
        
        console.log("usePriceTable useEffect:", {
            initialTemplateId,
            initialSlots,
            slotsChanged,
            templateIdChanged,
            previousInitialTemplateId: previousInitialTemplateId.current,
            previousInitialSlots: previousInitialSlots.current,
        });
        
        // Priority 1: If we have both template and slots (backend returned both), use slots directly
        // This is the most common case when viewing a court with a price template
        if (initialTemplateId && initialSlots && initialSlots.length > 0 && slotsChanged) {
            const slots: TimeSlot[] = initialSlots.map((slot, index) => ({
                id: `initial-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                startTime: normalizeTimeString(slot.startTime),
                endTime: normalizeTimeString(slot.endTime),
                price: slot.price.toString(),
            }));
            setCurrentSlots(slots);
            if (onSlotsChange) {
                onSlotsChange(slots);
            }
            previousInitialSlots.current = initialSlots;
            previousInitialTemplateId.current = initialTemplateId;
        }
        // Priority 2: If template ID changed and we have a template (but no slots), load it
        else if (templateIdChanged && initialTemplateId && !initialSlots) {
            loadTemplateItems(initialTemplateId, false);
            previousInitialTemplateId.current = initialTemplateId;
        }
        // Priority 3: If no template but slots are provided, use the slots directly
        // This is the case when viewing a price template detail (no template ID, just items)
        else if (!initialTemplateId && initialSlots && initialSlots.length > 0) {
            // Always set slots if they're provided and we don't have a template
            // Check if slots actually changed or if this is the first render
            if (slotsChanged || previousInitialSlots.current === undefined) {
                console.log("Setting slots from initialSlots (Priority 3):", initialSlots);
                const slots: TimeSlot[] = initialSlots.map((slot, index) => ({
                    id: `initial-${index}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    startTime: normalizeTimeString(slot.startTime),
                    endTime: normalizeTimeString(slot.endTime),
                    price: slot.price.toString(),
                }));
                console.log("Created TimeSlots:", slots);
                setCurrentSlots(slots);
                if (onSlotsChange) {
                    onSlotsChange(slots);
                }
                previousInitialSlots.current = initialSlots;
            }
        }
        // Priority 4: If template was cleared, clear slots too
        else if (templateIdChanged && !initialTemplateId && !initialSlots) {
            setCurrentSlots([]);
            if (onSlotsChange) {
                onSlotsChange([]);
            }
            previousInitialTemplateId.current = initialTemplateId;
        }
    }, [initialTemplateId, initialSlots, onSlotsChange, loadTemplateItems]);

    const handleTemplateChange = useCallback(async (templateId: string) => {
        console.log("handleTemplateChange called with:", templateId);
        
        // Mark this as a manual change to prevent useEffect from interfering
        isManualTemplateChange.current = true;
        
        setSelectedTemplateId(templateId);
        if (onTemplateChange) {
            onTemplateChange(templateId ? parseInt(templateId) : null);
        }

        if (!templateId) {
            setCurrentSlots([]);
            if (onSlotsChange) {
                onSlotsChange([]);
            }
            // Update refs to prevent useEffect from running
            previousInitialTemplateId.current = null;
            previousInitialSlots.current = undefined;
            isManualTemplateChange.current = false;
            return;
        }

        const templateIdNum = parseInt(templateId);
        console.log("Loading template items for ID:", templateIdNum);
        // Update ref to prevent useEffect from running again
        previousInitialTemplateId.current = templateIdNum;
        await loadTemplateItems(templateIdNum, true);
    }, [onSlotsChange, onTemplateChange, loadTemplateItems]);

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
