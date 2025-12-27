import { ENDPOINTS } from "@/constants/endpoint";
import type { PublicFacilitySummary, PublicFacilityDetail } from "../types/facility.type";
import { publicClient } from "@/lib/axios";
import type { ApiResponse } from "@/lib/axios";

export const publicFacilityService = {

    getFeaturedPublicFacilities: async (sportId: number): Promise<PublicFacilitySummary[]> => {
        const response = await publicClient.get<ApiResponse<PublicFacilitySummary[]>>(
            ENDPOINTS.PUBLIC.FACILITIES.FEATURED(sportId)
        );
        return response.data.data || [];
    },

    getAllPublicFacilities: async (): Promise<PublicFacilitySummary[]> => {
        const response = await publicClient.get<ApiResponse<PublicFacilitySummary[]>>(
            ENDPOINTS.PUBLIC.FACILITIES.ROOT
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
    },

    getNearbyPublicFacilities: async (
        latitude: number,
        longitude: number
    ): Promise<PublicFacilitySummary[]> => {
        const response = await publicClient.get<ApiResponse<PublicFacilitySummary[]>>(
            ENDPOINTS.PUBLIC.FACILITIES.NEARBY(latitude, longitude)
        );
        return response.data.data || [];
    }

}