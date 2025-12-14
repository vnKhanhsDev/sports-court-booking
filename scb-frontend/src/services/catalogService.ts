import { publicClient, type ApiResponse } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type { SportPublicResponse } from "@/types/catalog.types";

export const catalogService = {
    getCatalog: async (): Promise<SportPublicResponse[]> => {
        const response = await publicClient.get<ApiResponse<SportPublicResponse[]>>(
            ENDPOINTS.PUBLIC.CATALOG
        );
        return response.data.data || [];
    }
};