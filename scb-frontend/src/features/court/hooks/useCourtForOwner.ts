import useApi from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import { courtServiceForOwner } from "../services/courtService";
import type { FacilityBasicForOwner } from "../types/facility.types";
import type { CourtBasicForOwner } from "../types/court.types";

export default function useCourtForOwner() {
    const { execute, isLoading } = useApi();
    
    const [facilities, setFacilities] = useState<FacilityBasicForOwner[]>([]);
    const [courts, setCourts] = useState<CourtBasicForOwner[]>([]);

    const fetchFacilities = useCallback(async () => {
        const result = await execute(() => courtServiceForOwner.getFacilitiesWithCourts());
        if (result && Array.isArray(result)) {
            setFacilities(result);
            // Enrich courts with facility information when flattening
            const enrichedCourts = result.flatMap(facility => 
                facility.courts.map(court => ({
                    ...court,
                    facilityName: facility.name
                }))
            );
            setCourts(enrichedCourts);
        }
    }, [execute]);

    useEffect(() => {
        fetchFacilities();
    }, [fetchFacilities]);

    return { facilities, courts, isLoading, refetch: fetchFacilities };
}