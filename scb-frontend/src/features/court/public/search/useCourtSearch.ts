import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useApi from "@/hooks/useApi";
import { publicCourtService } from "@/features/court/services/courtService";
import type { PublicCourt } from "@/features/court/types/court.types";

export default function useCourtSearch() {
    const [searchParams] = useSearchParams();
    const { execute, isLoading } = useApi();
    const [courts, setCourts] = useState<PublicCourt[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchCourts = async () => {
        setError(null);
        
        const facilityIdParam = searchParams.get('facilityId');
        const sportIdParam = searchParams.get('sportId');
        
        const facilityId = facilityIdParam ? parseInt(facilityIdParam, 10) : undefined;
        const sportId = sportIdParam ? parseInt(sportIdParam, 10) : undefined;
        
        const result = await execute(async () => {
            return await publicCourtService.getPublicCourts(facilityId, sportId);
        });

        if (result && Array.isArray(result)) {
            setCourts(result);
        } else {
            setError("Không thể tải danh sách sân. Vui lòng thử lại sau.");
            setCourts([]);
        }
    };

    useEffect(() => {
        fetchCourts();
    }, [searchParams]);

    return {
        courts,
        isLoading,
        error,
        refetch: fetchCourts,
    };
}