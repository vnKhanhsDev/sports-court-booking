import { useQuery } from "@tanstack/react-query";
import { publicFacilityService } from "../services/publicFacilityService";
import type { PublicFacilitySummary } from "../types/facility.type";

export default function usePublicFacility() {

    const { data, isLoading, error, refetch } = useQuery<PublicFacilitySummary[], Error>({
        queryKey: ['publicFacilities'],
        queryFn: () => publicFacilityService.getAllPublicFacilities(),
        staleTime: 1000 * 60 * 5    // cache for 5 minutes
    });

    return {
        publicFacilities: data || [],
        isLoading,
        error,
        refetch,
    };
}