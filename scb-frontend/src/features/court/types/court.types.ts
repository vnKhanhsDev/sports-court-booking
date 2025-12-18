/**
 * Court Status - matches backend CourtStatus enum
 */
export type CourtStatus = "PENDING" | "ACTIVE" | "MAINTENANCE" | "CLOSED";

/**
 * Court Status constants for easier usage
 */
export const CourtStatusValues = {
    PENDING: "PENDING" as const,
    ACTIVE: "ACTIVE" as const,
    MAINTENANCE: "MAINTENANCE" as const,
    CLOSED: "CLOSED" as const,
} as const;

/**
 * Price Item DTO - matches backend PriceItemDto
 */
export interface PriceItem {
    startTime: string; // LocalTime format: "HH:mm:ss" or "HH:mm"
    endTime: string;   // LocalTime format: "HH:mm:ss" or "HH:mm"
    price: number;      // BigDecimal converted to number
}

/**
 * Court Image DTO - matches backend CourtImageDto
 */
export interface CourtImage {
    imageUrl: string;
    displayOrder: number;
}

/**
 * Facility Option - for dropdowns
 */
export interface FacilityOption {
    id: number;
    name: string;
}

/**
 * Owner Court Summary Response - matches backend OwnerCourtSummaryResponse
 */
export interface OwnerCourtSummary {
    id: number;
    facilityName: string;
    name: string;
    status: CourtStatus;
    isBooked: boolean;
}

/**
 * Owner Court Detail Response - matches backend OwnerCourtDetailResponse
 */
export interface OwnerCourtDetail {
    facilityId: number;
    sportId: number;
    courtTypeId: number;
    surfaceTypeId: number;
    name: string;
    priceTemplateId: number | null;
    items: PriceItem[];
    imageUrls: CourtImage[]; // Note: backend uses 'imageUrls' but contains CourtImageDto[]
    status: CourtStatus;
}

/**
 * Court Creation Request - matches backend CourtCreationRequest
 */
export interface CourtCreationRequest {
    facilityId: number;
    sportId: number;
    courtTypeId: number;
    surfaceTypeId: number;
    name: string;
    priceTemplateId?: number | null;
    items?: PriceItem[];
    images?: CourtImage[];
}

/**
 * Court Updation Request - matches backend CourtUpdationRequest
 */
export interface CourtUpdationRequest {
    facilityId: number;
    sportId: number;
    courtTypeId: number;
    surfaceTypeId: number;
    name: string;
    priceTemplateId?: number | null;
    items?: PriceItem[];
    images?: CourtImage[];
    status?: string; // CourtStatus as string
}

/**
 * Legacy type - kept for backward compatibility
 * @deprecated Use OwnerCourtSummary instead
 */
export interface CourtBasicForOwner {
    id: number;
    facilityName: string;
    sportName: string;
    courtTypeName: string;
    name: string;
    status: string;
    isBooked: boolean;
}

