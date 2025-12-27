import { useQuery } from "@tanstack/react-query";
import { publicFacilityService } from "../services/publicFacilityService";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { PublicFacilitySummary } from "../types/facility.type";

export default function useNearbyFacilities() {
    const { location, loading: locationLoading, error: locationError } = useGeolocation();

    const { data, isLoading, error, refetch } = useQuery<PublicFacilitySummary[], Error>({
        queryKey: ['nearbyFacilities', location?.lat, location?.lng],
        queryFn: () => {
            if (!location) {
                return Promise.resolve([]);
            }
            return publicFacilityService.getNearbyPublicFacilities(location.lat, location.lng);
        },
        enabled: !locationLoading && location !== null && !locationError,
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
        retry: false,
    });

    return {
        nearbyFacilities: data || [],
        isLoading: locationLoading || (location !== null && !locationError && isLoading),
        error: locationError || error,
        refetch,
        hasLocation: location !== null,
        locationLoading,
    };
}
