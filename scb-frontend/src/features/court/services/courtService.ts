import { privateClient, type ApiResponse } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type { FacilityBasicForOwner } from "../types/facility.types";
import type { PriceTemplateBasic, PriceTemplateDetail } from "../types/price.types";

export const courtServiceForOwner = {
    getFacilitiesWithCourts: async (): Promise<FacilityBasicForOwner[]> => {
        const response = await privateClient.get<ApiResponse<FacilityBasicForOwner[]>>(
            ENDPOINTS.OWNER.COURTS
        );
        return response.data.data || [];
    },

    getPriceTemplates: async (): Promise<PriceTemplateBasic[]> => {
        const response = await privateClient.get<ApiResponse<PriceTemplateBasic[]>>(
            ENDPOINTS.OWNER.PRICE_TEMPLATES
        );
        return response.data.data || [];
    },

    getPriceTemplateById: async (id: number): Promise<PriceTemplateDetail> => {
        const response = await privateClient.get<ApiResponse<PriceTemplateDetail>>(
            `${ENDPOINTS.OWNER.PRICE_TEMPLATES}/${id}`
        );
        return response.data.data!;
    }
}


export const courtServiceForAdmin = {
    
}