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

import type { PriceSlot } from "./price.types";

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
    priceListId: number | null;
    slots: PriceSlot[];
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
    priceListId?: number | null;
    slots?: PriceSlot[];
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
    priceListId?: number | null;
    slots?: PriceSlot[];
    images?: CourtImage[];
    status?: string; // CourtStatus as string
}

/**
 * Public Court Response - matches backend PublicCourtResponse
 */
export interface PublicCourt {
    id: number;
    name: string;
    status: CourtStatus;
    
    // Facility information
    facilityId: number;
    facilityName: string;
    facilityAddress: string;
    facilityLatitude: number | null;
    facilityLongitude: number | null;
    facilityOpeningTime: string; // LocalTime as string (HH:mm:ss)
    facilityClosingTime: string; // LocalTime as string (HH:mm:ss)
    
    // Sport and court type information
    sportId: number;
    sportName: string;
    courtTypeId: number;
    courtTypeName: string;
    surfaceTypeId: number;
    surfaceTypeName: string;
    
    // Pricing information
    priceSlots: PriceSlot[];
    
    // Images
    images: CourtImage[];
}

/**
 * Time Slot Availability Status - matches backend TimeSlotAvailability.SlotStatus
 */
export type SlotStatus = "AVAILABLE" | "BOOKED" | "LOCKED" | "PLAYED";

/**
 * Time Slot Availability - matches backend TimeSlotAvailability
 */
export interface TimeSlotAvailability {
    fromTime: string; // LocalTime as string (HH:mm:ss)
    toTime: string; // LocalTime as string (HH:mm:ss)
    price: number; // BigDecimal as number
    status: SlotStatus;
}

/**
 * Public Court Detail Response - matches backend PublicCourtDetailResponse
 */
export interface PublicCourtDetail {
    id: number;
    name: string;
    status: CourtStatus;
    
    // Facility information
    facilityId: number;
    facilityName: string;
    facilityDescription: string;
    facilityAddress: string;
    facilityLatitude: number | null;
    facilityLongitude: number | null;
    facilityOpeningTime: string; // LocalTime as string (HH:mm:ss)
    facilityClosingTime: string; // LocalTime as string (HH:mm:ss)
    facilityTotalCourts: number; // Number of courts in the facility
    
    // Sport and court type information
    sportId: number;
    sportName: string;
    courtTypeId: number;
    courtTypeName: string;
    surfaceTypeId: number;
    surfaceTypeName: string;
    
    // Pricing information
    priceSlots: PriceSlot[];
    
    // Images
    images: CourtImage[];
    
    // Booking availability for a specific date
    date: string; // LocalDate as string (YYYY-MM-DD)
    timeSlotAvailabilities: TimeSlotAvailability[];
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

