import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import type { PublicFacility } from "../types/facility.types";
import { publicFacilityService } from "../services/publicFacilityService";

export default function useFacilities() {
    const { execute, isLoading } = useApi();
    const [facilities, setFacilities] = useState<PublicFacility[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchFacilities = useCallback(async () => {
        setError(null);
        const result = await execute(async () => {
            return await publicFacilityService.getAllPublicFacilities();
        });

        if (result && Array.isArray(result)) {
            setFacilities(result);
        } else {
            setError("Không thể tải danh sách cơ sở. Vui lòng thử lại sau.");
            setFacilities([]);
        }
    }, [execute]);

    useEffect(() => {
        fetchFacilities();
    }, [fetchFacilities]);

    return { 
        facilities, 
        isLoading, 
        error,
        refetch: fetchFacilities 
    };
}