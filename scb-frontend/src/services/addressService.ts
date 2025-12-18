import { publicClient, type ApiResponse } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type { Province, District, Ward } from "@/types/address.types";

export const addressService = {

    getAllProvinces: async (): Promise<Province[]> => {
        const response = await publicClient.get<ApiResponse<Province[]>>(
            ENDPOINTS.PUBLIC.ADDRESS.PROVINCES
        );
        return response.data.data || [];
    },

    getAllDistrictsByProvinceCode: async (provinceCode: string): Promise<District[]> => {
        const response = await publicClient.get<ApiResponse<District[]>>(
            ENDPOINTS.PUBLIC.ADDRESS.DISTRICTS(provinceCode)
        );
        return response.data.data || [];
    },

    getAllWardsByDistrictCode: async (districtCode: string): Promise<Ward[]> => {
        const response = await publicClient.get<ApiResponse<Ward[]>>(
            ENDPOINTS.PUBLIC.ADDRESS.WARDS(districtCode)
        );
        return response.data.data || [];
    },

}