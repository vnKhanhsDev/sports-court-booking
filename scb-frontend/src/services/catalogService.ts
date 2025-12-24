import { publicClient, type ApiResponse } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type { PublicSport } from "@/types/catalog.types";

export const catalogService = {

    getPublicCatalog: async (): Promise<PublicSport[]> => {
        const response = await publicClient.get<ApiResponse<PublicSport[]>>(
            ENDPOINTS.PUBLIC.CATALOG
        );
        return response.data.data || [];
    }

}