import useApi from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import type { FacilityOption } from "../types/court.types";
import { courtServiceForOwner } from "../services/courtService";

export default function useFacility() {
    const { execute, isLoading } = useApi();
    
    const [facilityOptions, setFacilityOptions] = useState<FacilityOption[]>([]);

    const fetchFacilityOptions = useCallback(async () => {
        const result = await execute(() => courtServiceForOwner.getFacilityOptions());
        if (result && Array.isArray(result)) {
            setFacilityOptions(result);
        }
    }, [execute]);

    useEffect(() => {
        fetchFacilityOptions();
    }, [fetchFacilityOptions]);

    return {
        facilityOptions,
        isLoading,
    };
}