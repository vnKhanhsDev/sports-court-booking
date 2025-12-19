import { ENDPOINTS } from "@/constants/endpoint";
import { privateClient, type ApiResponse } from "@/lib/axios";
import type { PriceListOption, PriceListUpsert, PriceListDetail, PriceListSummary } from "../types/price.types";

export const priceListService = {
    getAllPriceLists: async (): Promise<PriceListSummary[]> => {
        const response = await privateClient.get<ApiResponse<PriceListSummary[]>>(
            ENDPOINTS.OWNER.PRICE_LISTS.ROOT
        );
        return response.data.data || [];
    },

    createPriceList: async (request: PriceListUpsert): Promise<PriceListSummary[]> => {
        const response = await privateClient.post<ApiResponse<PriceListSummary[]>>(
            ENDPOINTS.OWNER.PRICE_LISTS.ROOT,
            request
        );
        return response.data.data || [];
    },

    getPriceListById: async (id: number): Promise<PriceListDetail | null> => {
        const response = await privateClient.get<ApiResponse<PriceListDetail>>(
            ENDPOINTS.OWNER.PRICE_LISTS.BY_ID(id)
        );
        return response.data.data ?? null;
    },

    getPriceListOptions: async (): Promise<PriceListOption[]> => {
        const response = await privateClient.get<ApiResponse<PriceListOption[]>>(
            ENDPOINTS.OWNER.PRICE_LISTS.OPTIONS
        );
        return response.data.data || [];
    },

    updatePriceList: async (id: number, request: PriceListUpsert): Promise<PriceListSummary[]> => {
        const response = await privateClient.put<ApiResponse<PriceListSummary[]>>(
            ENDPOINTS.OWNER.PRICE_LISTS.BY_ID(id),
            request
        );
        return response.data.data || [];
    },

    deletePriceList: async (id: number): Promise<PriceListSummary[]> => {
        const response = await privateClient.delete<ApiResponse<PriceListSummary[]>>(
            ENDPOINTS.OWNER.PRICE_LISTS.BY_ID(id)
        );
        return response.data.data || [];
    },
};
