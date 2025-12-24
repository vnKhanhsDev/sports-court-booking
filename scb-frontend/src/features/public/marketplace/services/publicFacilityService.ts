import { ENDPOINTS } from "@/constants/endpoint";
import type { PublicFacilitySummary, PublicFacilityDetail } from "../types/facility.type";
import { publicClient } from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";

export const publicFacilityService = {

    getAllPublicFacilities: async (): Promise<PublicFacilitySummary[]> => {
        const response = await publicClient.get<ApiResponse<PublicFacilitySummary[]>>(
            ENDPOINTS.MARKETPLACE.FACILITIES
        );
        return response.data.data || [];
    },

    getPublicFacilityDetail: async (
        facilityId: number,
        sportId: number
    ): Promise<PublicFacilityDetail> => {
        const response = await publicClient.get<ApiResponse<PublicFacilityDetail>>(
            ENDPOINTS.MARKETPLACE.FACILITY_DETAIL(facilityId, sportId)
        );
        return response.data.data!;
    }

}