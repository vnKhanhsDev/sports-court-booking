import { useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import { publicCourtService } from "@/features/court/services/courtService";
import type { PublicCourt } from "@/features/court/types/court.types";

export default function useCourtSearch() {
    const { execute, isLoading } = useApi();
    const [courts, setCourts] = useState<PublicCourt[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchCourts = async () => {
        setError(null);
        const result = await execute(async () => {
            return await publicCourtService.getPublicCourts();
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
    }, []);

    return {
        courts,
        isLoading,
        error,
        refetch: fetchCourts,
    };
}