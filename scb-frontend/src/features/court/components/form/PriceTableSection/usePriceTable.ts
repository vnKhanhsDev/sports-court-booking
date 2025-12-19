import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { priceListService } from "../../../services/priceListService";
import type { PriceListOption, PriceSlot } from "../../../types/price.types";
import { normalizeTimeString, type TimeSlot } from "./priceTable.utils";

export interface UsePriceTableProps {
    priceLists?: PriceListOption[];
    facilityId?: string;
    sportId?: string;
    initialPriceListId?: number | null;
    initialSlots?: Array<{ startTime: string; endTime: string; price: number }>;
    onPriceListChange?: (priceListId: number | null) => void;
    onSlotsChange?: (slots: TimeSlot[]) => void;
}

export interface UsePriceTableReturn {
    selectedPriceListId: string;
    slots: TimeSlot[];
    isLoadingPriceList: boolean;
    filteredPriceLists: PriceListOption[];
    handlePriceListChange: (priceListId: string) => void;
    handleSlotsChange: (newSlots: TimeSlot[]) => void;
}

export default function usePriceTable({
    priceLists = [],
    facilityId,
    sportId,
    initialPriceListId,
    initialSlots,
    onPriceListChange,
    onSlotsChange,
}: UsePriceTableProps): UsePriceTableReturn {
    
    const [selectedPriceListId, setSelectedPriceListId] = useState<string>(
        initialPriceListId ? initialPriceListId.toString() : ""
    );
    
    const [currentSlots, setCurrentSlots] = useState<TimeSlot[]>([]);
    const [isLoadingPriceList, setIsLoadingPriceList] = useState(false);
    const previousInitialPriceListId = useRef<number | null | undefined>(undefined);
    const previousInitialSlots = useRef<Array<{ startTime: string; endTime: string; price: number }> | undefined>(undefined);
    const isManualPriceListChange = useRef(false);

    const filteredPriceLists = useMemo(() => {
        const facilityIdNum = facilityId ? parseInt(facilityId) : null;
        const sportIdNum = sportId ? parseInt(sportId) : null;

        return priceLists.filter((priceList) => {
            const facilityOk =
                priceList.facilityId === null ||
                facilityIdNum === null ||
                priceList.facilityId === facilityIdNum;

            const sportOk =
                priceList.sportId === null ||
                sportIdNum === null ||
                priceList.sportId === sportIdNum;

            // No court type / surface type filters provided from caller, so keep null-friendly pass-through
            const courtTypeOk = true;
            const surfaceTypeOk = true;

            return facilityOk && sportOk && courtTypeOk && surfaceTypeOk;
        });
    }, [priceLists, facilityId, sportId]);

    // Function to load price list slots
    const loadPriceListSlots = useCallback(async (priceListId: number, isManual = false) => {
        setIsLoadingPriceList(true);
        try {
            // Call the service to get price list detail which includes slots
            const priceListDetail = await priceListService.getPriceListById(priceListId);

            console.log("Loaded price list detail:", priceListDetail, "for price list ID:", priceListId);

            if (priceListDetail && priceListDetail.slots && priceListDetail.slots.length > 0) {
                const newSlots: TimeSlot[] = priceListDetail.slots.map((slot, index) => ({
                    id: `priceList-${priceListId}-${index}-${Math.random().toString(36).slice(2, 9)}`,
                    startTime: normalizeTimeString(slot.fromTime),
                    endTime: normalizeTimeString(slot.toTime),
                    price: slot.price.toString(),
                }));
                console.log("Created slots from price list slots:", newSlots);
                setCurrentSlots(newSlots);
                if (onSlotsChange) {
                    onSlotsChange(newSlots);
                }
            } else {
                console.warn("No slots found for price list ID:", priceListId);
                setCurrentSlots([]);
                if (onSlotsChange) {
                    onSlotsChange([]);
                }
            }
        } catch (error) {
            console.error("Failed to load price list slots:", error);
            setCurrentSlots([]);
            if (onSlotsChange) {
                onSlotsChange([]);
            }
        } finally {
            setIsLoadingPriceList(false);
            // Reset manual flag after loading completes
            if (isManual) {
                // Use setTimeout to ensure state updates are processed first
                setTimeout(() => {
                    isManualPriceListChange.current = false;
                }, 0);
            }
        }
    }, [onSlotsChange]);

    // Sync selectedPriceListId with initialPriceListId prop changes
    useEffect(() => {
        const newPriceListId = initialPriceListId ? initialPriceListId.toString() : "";
        if (newPriceListId !== selectedPriceListId) {
            setSelectedPriceListId(newPriceListId);
        }
    }, [initialPriceListId, selectedPriceListId]);

    // Handle initial price list loading or initial slots
    useEffect(() => {
        // Don't interfere with manual price list changes - let the async operation complete first
        if (isManualPriceListChange.current) {
            return;
        }

        const priceListIdChanged = previousInitialPriceListId.current !== initialPriceListId;
        // Compare slots properly - handle undefined/null cases
        const previousSlotsStr = previousInitialSlots.current ? JSON.stringify(previousInitialSlots.current) : null;
        const currentSlotsStr = initialSlots ? JSON.stringify(initialSlots) : null;
        const slotsChanged = previousSlotsStr !== currentSlotsStr;
        
        console.log("usePriceTable useEffect:", {
            initialPriceListId,
            initialSlots,
            slotsChanged,
            priceListIdChanged,
            previousInitialPriceListId: previousInitialPriceListId.current,
            previousInitialSlots: previousInitialSlots.current,
        });
        
        // Priority 1: If we have both price list and slots (backend returned both), use slots directly
        // This is the most common case when viewing a court with a price list
        if (initialPriceListId && initialSlots && initialSlots.length > 0 && slotsChanged) {
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
            previousInitialPriceListId.current = initialPriceListId;
        }
        // Priority 2: If price list ID changed and we have a price list (but no slots), load it
        else if (priceListIdChanged && initialPriceListId && !initialSlots) {
            loadPriceListSlots(initialPriceListId, false);
            previousInitialPriceListId.current = initialPriceListId;
        }
        // Priority 3: If no price list but slots are provided, use the slots directly
        // This is the case when viewing a price list detail (no price list ID, just slots)
        else if (!initialPriceListId && initialSlots && initialSlots.length > 0) {
            // Always set slots if they're provided and we don't have a price list
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
        // Priority 4: If price list was cleared, clear slots too
        else if (priceListIdChanged && !initialPriceListId && !initialSlots) {
            setCurrentSlots([]);
            if (onSlotsChange) {
                onSlotsChange([]);
            }
            previousInitialPriceListId.current = initialPriceListId;
        }
    }, [initialPriceListId, initialSlots, onSlotsChange, loadPriceListSlots]);

    const handlePriceListChange = useCallback(async (priceListId: string) => {
        console.log("handlePriceListChange called with:", priceListId);
        
        // Mark this as a manual change to prevent useEffect from interfering
        isManualPriceListChange.current = true;
        
        setSelectedPriceListId(priceListId);
        if (onPriceListChange) {
            onPriceListChange(priceListId ? parseInt(priceListId) : null);
        }

        if (!priceListId) {
            setCurrentSlots([]);
            if (onSlotsChange) {
                onSlotsChange([]);
            }
            // Update refs to prevent useEffect from running
            previousInitialPriceListId.current = null;
            previousInitialSlots.current = undefined;
            isManualPriceListChange.current = false;
            return;
        }

        const priceListIdNum = parseInt(priceListId);
        console.log("Loading price list slots for ID:", priceListIdNum);
        // Update ref to prevent useEffect from running again
        previousInitialPriceListId.current = priceListIdNum;
        await loadPriceListSlots(priceListIdNum, true);
    }, [onSlotsChange, onPriceListChange, loadPriceListSlots]);

    const handleSlotsChange = useCallback((newSlots: TimeSlot[]) => {
        setCurrentSlots(newSlots);
        if (selectedPriceListId) {
            setSelectedPriceListId("");
            if (onPriceListChange) {
                onPriceListChange(null);
            }
        }
        if (onSlotsChange) {
            onSlotsChange(newSlots);
        }
    }, [onSlotsChange, onPriceListChange, selectedPriceListId]);

    return {
        selectedPriceListId,
        slots: currentSlots,
        isLoadingPriceList,
        filteredPriceLists,
        handlePriceListChange,
        handleSlotsChange,
    };
}
