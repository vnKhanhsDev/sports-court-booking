import { publicClient, type ApiResponse } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type { Province, District, Ward } from "@/types/address.types";

export const fetchProvinces = async (): Promise<Province[]> => {
    const response = await publicClient.get<ApiResponse<Province[]>>(
        ENDPOINTS.PUBLIC.ADDRESS.PROVINCES
    );
    if (!response.data.success) throw new Error('Failed to fetch provinces');
    return response.data.data || [];
}

export const fetchDistrictsByProvinceCode = async (provinceCode: string): Promise<District[]> => {
    const response = await publicClient.get<ApiResponse<District[]>>(
        ENDPOINTS.PUBLIC.ADDRESS.DISTRICTS(provinceCode)
    );
    if (!response.data.success) throw new Error('Failed to fetch districts');
    return response.data.data || [];
}

export const fetchWardsByDistrictCode = async (districtCode: string): Promise<Ward[]> => {
    const response = await publicClient.get<ApiResponse<Ward[]>>(
        ENDPOINTS.PUBLIC.ADDRESS.WARDS(districtCode)
    );
    if (!response.data.success) throw new Error('Failed to fetch wards');
    return response.data.data || [];
}