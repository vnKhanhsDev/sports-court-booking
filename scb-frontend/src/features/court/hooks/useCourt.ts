import useApi from "@/hooks/useApi";
import { useCallback, useState } from "react";
import type { OwnerCourtSummary } from "../types/court.types";
import { courtServiceForOwner } from "../services/courtService";
import { useEffect } from "react";

export default function useCourt() {
    const { execute, isLoading } = useApi();
    
    const [ownerCourts, setOwnerCourts] = useState<OwnerCourtSummary[]>([]);

    const fetchOwnerCourts = useCallback(async () => {
            const result = await execute(() => courtServiceForOwner.getAllCourts());
            if (result && Array.isArray(result)) {
                setOwnerCourts(result);
            }
    }, [execute]);

    useEffect(() => {
        fetchOwnerCourts();
    }, [fetchOwnerCourts]);

    return {
        ownerCourts,
        isCourtsLoading: isLoading,
        refetchCourts: fetchOwnerCourts,
    };
}