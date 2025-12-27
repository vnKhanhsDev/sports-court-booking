import { useState, useEffect } from "react";
import useApi from "@/hooks/useApi";
import { publicFacilityService } from "../services/publicFacilityService";
import type { PublicFacilityDetail } from "../types/facility.type";

export default function usePublicFacilityDetail(facilityId: number | null, sportId: number | null) {
    const { execute, isLoading } = useApi();
    const [facility, setFacility] = useState<PublicFacilityDetail | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!facilityId || !sportId) {
            setFacility(null);
            setError(null);
            return;
        }

        const fetchFacility = async () => {
            setError(null);
            const result = await execute(async () => {
                return await publicFacilityService.getPublicFacilityDetail(facilityId, sportId);
            });

            if (result) {
                setFacility(result);
            } else {
                setError("Không thể tải thông tin cơ sở. Vui lòng thử lại sau.");
                setFacility(null);
            }
        };

        fetchFacility();
    }, [facilityId, sportId, execute]);

    return {
        facility,
        isLoading,
        error,
    };
}

