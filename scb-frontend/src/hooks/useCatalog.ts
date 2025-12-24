import { useQuery } from "@tanstack/react-query";
import { catalogService } from "@/services/catalogService";
import type { PublicSport } from "@/types/catalog.types";

export default function useCatalog() {
    const { data, isLoading, error, refetch } = useQuery<PublicSport[], Error>({
        queryKey: ['catalog'],
        queryFn: () => catalogService.getPublicCatalog(),
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
    });

    return {
        catalog: data || [],
        isLoading,
        error,
        refetch,
    };
}