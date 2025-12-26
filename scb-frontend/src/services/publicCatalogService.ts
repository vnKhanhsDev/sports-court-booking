import { publicClient, type ApiResponse } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type { PublicSport } from "@/types/catalog.types";

export const publicCatalogService = {

    getAllCatalog: async (): Promise<PublicSport[]> => {
        const response = await publicClient.get<ApiResponse<PublicSport[]>>(
            ENDPOINTS.PUBLIC.CATALOG.ROOT
        );
        return response.data.data || [];
    },

    getSportCatalog: async (): Promise<PublicSport[]> => {
        const response = await publicClient.get<ApiResponse<PublicSport[]>>(
            ENDPOINTS.PUBLIC.CATALOG.SPORTS
        );
        return response.data.data || [];
    }

}