import { publicClient, type ApiResponse } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type { PublicFacility } from "../types/facility.types";

export const publicFacilityService = {
    
    /**
     * Get all public facilities
     * @returns List of public facilities
     */
    getAllPublicFacilities: async (): Promise<PublicFacility[]> => {
        const response = await publicClient.get<ApiResponse<PublicFacility[]>>(
            ENDPOINTS.MARKETPLACE.FACILITIES
        );
        return response.data.data || [];
    },

}