import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import { facilityService } from "../services/facilityService";
import type { AdminFacilitySummary } from "../types/facility.types";

export default function useAdminFacilities() {
    const { execute, isLoading: isAdminFacilitiesLoading } = useApi();

    const [adminFacilities, setAdminFacilities] = useState<AdminFacilitySummary[]>([]);

    const fetchAdminFacilities = useCallback(async () => {
        const result = await execute(() => facilityService.getAllAdminFacilities());
        if (result && Array.isArray(result)) {
            setAdminFacilities(result);
        }
    }, [execute]);

    useEffect(() => {
        fetchAdminFacilities();
    }, [fetchAdminFacilities]);

    const approveFacility = useCallback(
        async (id: number) => {
            const result = await execute(() => facilityService.approveFacility(id));
            if (result && Array.isArray(result)) {
                setAdminFacilities(result);
            }
        },
        [execute]
    );

    const rejectFacility = useCallback(
        async (id: number) => {
            const result = await execute(() => facilityService.rejectFacility(id));
            if (result && Array.isArray(result)) {
                setAdminFacilities(result);
            }
        },
        [execute]
    );

    const approveAllFacilities = useCallback(
        async () => {
            const result = await execute(() => facilityService.approveAllFacilities());
            if (result && Array.isArray(result)) {
                setAdminFacilities(result);
            }
        },
        [execute]
    );

    return {
        adminFacilities,
        isAdminFacilitiesLoading,
        approveFacility,
        rejectFacility,
        approveAllFacilities,
        refetch: fetchAdminFacilities,
    };
}
