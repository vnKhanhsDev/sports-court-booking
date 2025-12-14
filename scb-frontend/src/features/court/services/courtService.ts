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
    },

    createCourt: async (data: {
        facilityId: number;
        sportId: number;
        courtTypeId: number;
        surfaceTypeId: number;
        name: string;
        priceTemplateId?: number;
        priceItems?: Array<{ startTime: string; endTime: string; price: number }>;
        imageUrls?: string[];
    }): Promise<number> => {
        const requestBody: any = {
            facilityId: data.facilityId,
            sportId: data.sportId,
            courtTypeId: data.courtTypeId,
            surfaceTypeId: data.surfaceTypeId,
            name: data.name,
        };
        
        // Only include priceTemplateId if it's a valid number
        if (data.priceTemplateId !== undefined && data.priceTemplateId !== null && !isNaN(data.priceTemplateId)) {
            requestBody.priceTemplateId = data.priceTemplateId;
        }
        
        // Only include priceItems if provided and not empty
        if (data.priceItems && data.priceItems.length > 0) {
            requestBody.priceItems = data.priceItems;
        }
        
        // Only include imageUrls if provided and not empty
        if (data.imageUrls && data.imageUrls.length > 0) {
            requestBody.imageUrls = data.imageUrls;
        }
        
        const response = await privateClient.post<ApiResponse<number>>(
            ENDPOINTS.OWNER.COURTS,
            requestBody
        );
        return response.data.data!;
    }
}


export const courtServiceForAdmin = {
    
}