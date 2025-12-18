import useApi from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import type { FacilityOption } from "../types/court.types";
import type { OwnerFacilitySummary } from "../types/facility.types";
import { facilityService } from "../services/facilityService";

export default function useFacility() {
    const { execute, isLoading } = useApi();
    
    const [facilities, setFacilities] = useState<OwnerFacilitySummary[]>([]);
    const [facilityOptions, setFacilityOptions] = useState<FacilityOption[]>([]);

    const fetchFacilityOptions = useCallback(async () => {
        const result = await execute(() => facilityService.getFacilityOptions());
        if (result && Array.isArray(result)) {
            setFacilityOptions(result);
        }
    }, [execute]);

    const fetchFacilities = useCallback(async () => {
        const result = await execute(() => facilityService.getAllFacilities());
        if (result && Array.isArray(result)) {
            setFacilities(result);
        }
    }, [execute]);

    useEffect(() => {
        fetchFacilityOptions();
    }, [fetchFacilityOptions]);

    /**
     * Fetch all facilities for the owner
     */
    useEffect(() => {
        fetchFacilities();
    }, [fetchFacilities]);

    return {
        facilities,
        facilityOptions,
        isFacilitiesLoading: isLoading,
        refetchFacilities: fetchFacilities,
    };
}
