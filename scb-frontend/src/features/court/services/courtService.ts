import { privateClient, type ApiResponse } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type {
    OwnerCourtSummary,
    OwnerCourtDetail,
    CourtCreationRequest,
    CourtUpdationRequest,
} from "../types/court.types";

/**
 * Court service for owner operations
 */
export const courtServiceForOwner = {
    /**
     * Get all courts for the authenticated owner
     * @returns List of court summaries
     */
    getAllCourts: async (): Promise<OwnerCourtSummary[]> => {
        const response = await privateClient.get<ApiResponse<OwnerCourtSummary[]>>(
            ENDPOINTS.OWNER.COURTS.ROOT
        );
        return response.data.data || [];
    },
    
    /**
     * Get court detail by ID
     * @param id - Court ID
     * @returns Court detail
     */
    getCourtById: async (id: number): Promise<OwnerCourtDetail> => {
        const response = await privateClient.get<ApiResponse<OwnerCourtDetail>>(
            ENDPOINTS.OWNER.COURTS.BY_ID(id)
        );
        return response.data.data!;
    },

    /**
     * Create a new court
     * @param data - Court creation request data
     * @returns List of updated court summaries
     */
    createCourt: async (data: CourtCreationRequest): Promise<OwnerCourtSummary[]> => {
        const response = await privateClient.post<ApiResponse<OwnerCourtSummary[]>>(
            ENDPOINTS.OWNER.COURTS.ROOT,
            data
        );
        return response.data.data || [];
    },

    /**
     * Update an existing court
     * @param id - Court ID
     * @param data - Court updation request data
     * @returns List of updated court summaries
     */
    updateCourt: async (
        id: number,
        data: CourtUpdationRequest
    ): Promise<OwnerCourtSummary[]> => {
        const response = await privateClient.put<ApiResponse<OwnerCourtSummary[]>>(
            ENDPOINTS.OWNER.COURTS.BY_ID(id),
            data
        );
        return response.data.data || [];
    },

    /**
     * Delete a court
     * @param id - Court ID
     * @returns List of updated court summaries
     */
    deleteCourt: async (id: number): Promise<OwnerCourtSummary[]> => {
        const response = await privateClient.delete<ApiResponse<OwnerCourtSummary[]>>(
            ENDPOINTS.OWNER.COURTS.BY_ID(id)
        );
        return response.data.data || [];
    },
};

/**
 * Court service for admin operations
 * (Reserved for future admin functionality)
 */
export const courtServiceForAdmin = {
    // Admin-specific court operations can be added here
};