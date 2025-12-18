import { privateClient, type ApiResponse } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type { FacilityCreation, FacilityDetail, FacilityUpdation, OwnerFacilitySummary } from "../types/facility.types";
import type { FacilityOption } from "../types/court.types";

export const facilityService = {

    getAllFacilities: async (): Promise<OwnerFacilitySummary[]> => {
        const response = await privateClient.get<ApiResponse<OwnerFacilitySummary[]>>(
            ENDPOINTS.OWNER.FACILITIES.ROOT
        );
        return response.data.data || [];
    },

    createFacility: async (facility: FacilityCreation): Promise<OwnerFacilitySummary[]> => {
        const response = await privateClient.post<ApiResponse<OwnerFacilitySummary[]>>(
            ENDPOINTS.OWNER.FACILITIES.ROOT,
            facility
        );
        return response.data.data || [];
    },

    getFacilityById: async (id: number | string): Promise<FacilityDetail | null> => {
        const response = await privateClient.get<ApiResponse<FacilityDetail>>(
            ENDPOINTS.OWNER.FACILITIES.BY_ID(id)
        );
        return response.data.data || null;
    },

    updateFacility: async (id: number | string, facility: FacilityUpdation): Promise<OwnerFacilitySummary[]> => {
        const response = await privateClient.put<ApiResponse<OwnerFacilitySummary[]>>(
            ENDPOINTS.OWNER.FACILITIES.BY_ID(id),
            facility
        );
        return response.data.data || [];
    },

    deleteFacility: async (id: number | string): Promise<OwnerFacilitySummary[]> => {
        const response = await privateClient.delete<ApiResponse<OwnerFacilitySummary[]>>(
            ENDPOINTS.OWNER.FACILITIES.BY_ID(id)
        );
        return response.data.data || [];
    },

    getFacilityOptions: async (): Promise<FacilityOption[]> => {
        const response = await privateClient.get<ApiResponse<FacilityOption[]>>(
            ENDPOINTS.OWNER.FACILITIES.OPTIONS
        );
        return response.data.data || [];
    }

}