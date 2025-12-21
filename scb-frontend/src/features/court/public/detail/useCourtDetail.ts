import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useApi from "@/hooks/useApi";
import { publicCourtService } from "@/features/court/services/courtService";
import type { PublicCourtDetail } from "@/features/court/types/court.types";

export default function useCourtDetail(date?: string) {
    const { id } = useParams<{ id: string }>();
    const { execute, isLoading } = useApi();
    const [courtDetail, setCourtDetail] = useState<PublicCourtDetail | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchCourtDetail = useCallback(async (courtId: string, selectedDate?: string) => {
        setError(null);
        const result = await execute(async () => {
            return await publicCourtService.getPublicCourtDetail(courtId, selectedDate);
        });

        if (result && result.id) {
            setCourtDetail(result);
        } else {
            setError("Không thể tải thông tin sân. Vui lòng thử lại sau.");
            setCourtDetail(null);
        }
    }, [execute]);

    useEffect(() => {
        if (id) {
            // Use today's date if no date provided
            const dateToUse = date || new Date().toISOString().split('T')[0];
            fetchCourtDetail(id, dateToUse);
        }
    }, [id, date, fetchCourtDetail]);

    const refetch = useCallback((selectedDate?: string) => {
        if (id) {
            const dateToUse = selectedDate || new Date().toISOString().split('T')[0];
            fetchCourtDetail(id, dateToUse);
        }
    }, [id, fetchCourtDetail]);

    return {
        courtDetail,
        isLoading,
        error,
        refetch,
    };
}
