import { ENDPOINTS } from "@/constants/endpoint";
import { privateClient, type ApiResponse } from "@/lib/axios";
import type { PriceTemplateOption, PriceTemplateUpsert, PriceTemplateDetail, PriceTemplateItem, PriceTemplateSummary } from "../types/price.types";

export const priceTemplateService = {
    getAllPriceTemplates: async (): Promise<PriceTemplateSummary[]> => {
        const response = await privateClient.get<ApiResponse<PriceTemplateSummary[]>>(
            ENDPOINTS.OWNER.PRICE_TEMPLATES.ROOT
        );
        return response.data.data || [];
    },

    createPriceTemplate: async (request: PriceTemplateUpsert): Promise<PriceTemplateSummary[]> => {
        const response = await privateClient.post<ApiResponse<PriceTemplateSummary[]>>(
            ENDPOINTS.OWNER.PRICE_TEMPLATES.ROOT,
            request
        );
        return response.data.data || [];
    },

    getPriceTemplateById: async (id: number): Promise<PriceTemplateDetail | null> => {
        const response = await privateClient.get<ApiResponse<PriceTemplateDetail>>(
            ENDPOINTS.OWNER.PRICE_TEMPLATES.BY_ID(id)
        );
        return response.data.data ?? null;
    },

    getPriceTemplateOptions: async (): Promise<PriceTemplateOption[]> => {
        const response = await privateClient.get<ApiResponse<PriceTemplateOption[]>>(
            ENDPOINTS.OWNER.PRICE_TEMPLATES.OPTIONS
        );
        return response.data.data || [];
    },

    getPriceTemplateItemsById: async (id: number): Promise<PriceTemplateItem[]> => {
        const response = await privateClient.get<ApiResponse<PriceTemplateItem[]>>(
            `${ENDPOINTS.OWNER.PRICE_TEMPLATES.ITEMS(id)}`
        );
        return response.data.data || [];
    },

    updatePriceTemplate: async (id: number, request: PriceTemplateUpsert): Promise<PriceTemplateSummary[]> => {
        const response = await privateClient.put<ApiResponse<PriceTemplateSummary[]>>(
            `${ENDPOINTS.OWNER.PRICE_TEMPLATES.BY_ID(id)}`,
            request
        );
        return response.data.data || [];
    },

    deletePriceTemplate: async (id: number): Promise<PriceTemplateSummary[]> => {
        const response = await privateClient.delete<ApiResponse<PriceTemplateSummary[]>>(
            `${ENDPOINTS.OWNER.PRICE_TEMPLATES.BY_ID(id)}`
        );
        return response.data.data || [];
    },
};