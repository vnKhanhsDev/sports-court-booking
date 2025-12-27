import { useQuery } from "@tanstack/react-query";
import { publicFacilityService } from "../services/publicFacilityService";
import type { PublicFacilitySummary } from "../types/facility.type";

export default function useFeaturedFacilities(sportId: number | null) {
    const { data, isLoading, error, refetch } = useQuery<PublicFacilitySummary[], Error>({
        queryKey: ['featuredFacilities', sportId],
        queryFn: () => {
            if (!sportId) {
                return Promise.resolve([]);
            }
            return publicFacilityService.getFeaturedPublicFacilities(sportId);
        },
        enabled: sportId !== null,
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
    });

    return {
        featuredFacilities: data || [],
        isLoading,
        error,
        refetch,
    };
}

