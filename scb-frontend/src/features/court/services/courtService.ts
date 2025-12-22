import { privateClient, publicClient, type ApiResponse } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/endpoint";
import type {
    OwnerCourtSummary,
    OwnerCourtDetail,
    CourtCreationRequest,
    CourtUpdationRequest,
    PublicCourt,
    PublicCourtDetail,
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

/**
 * Public court service for unauthenticated users
 */
export const publicCourtService = {
    /**
     * Get all public courts (ACTIVE courts from APPROVED facilities)
     * @param facilityId - Optional facility ID to filter by
     * @param sportId - Optional sport ID to filter by
     * @returns List of public courts
     */
    getPublicCourts: async (facilityId?: number, sportId?: number): Promise<PublicCourt[]> => {
        const params = new URLSearchParams();
        if (facilityId !== undefined) {
            params.append('facilityId', facilityId.toString());
        }
        if (sportId !== undefined) {
            params.append('sportId', sportId.toString());
        }
        
        const url = params.toString() 
            ? `${ENDPOINTS.PUBLIC.COURTS}?${params.toString()}`
            : ENDPOINTS.PUBLIC.COURTS;
            
        const response = await publicClient.get<ApiResponse<PublicCourt[]>>(url);
        return response.data.data || [];
    },

    /**
     * Get public court detail by ID
     * @param id - Court ID
     * @param date - Optional date for booking availability (defaults to today)
     * @returns Court detail with booking availability
     */
    getPublicCourtDetail: async (id: number | string, date?: string): Promise<PublicCourtDetail> => {
        const url = date 
            ? `${ENDPOINTS.PUBLIC.COURT_DETAIL(id)}?date=${date}`
            : ENDPOINTS.PUBLIC.COURT_DETAIL(id);
        const response = await publicClient.get<ApiResponse<PublicCourtDetail>>(url);
        return response.data.data!;
    },
};