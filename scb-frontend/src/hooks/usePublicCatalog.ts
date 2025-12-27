import { useQuery } from "@tanstack/react-query";
import { publicCatalogService } from "@/services/publicCatalogService";
import type { PublicSport } from "@/types/catalog.types";

export default function usePublicCatalog() {
    const {
        data: catalog = [],
        isLoading: catalogLoading,
        error: catalogError,
        refetch: catalogRefetch
    } = useQuery<PublicSport[]>({
        queryKey: ['catalog'],
        queryFn: () => publicCatalogService.getAllCatalog(),
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
    });

    const {
        data: sportCatalog = [],
        isLoading: sportCatalogLoading,
        error: sportCatalogError,
        refetch: sportCatalogRefetch
    } = useQuery<PublicSport[], Error>({
        queryKey: ['sportCatalog'],
        queryFn: () => publicCatalogService.getSportCatalog(),
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
    });

    return {
        catalog,
        catalogLoading,
        catalogError,
        catalogRefetch,
        sportCatalog,
        sportCatalogLoading,
        sportCatalogError,
        sportCatalogRefetch
    };
}