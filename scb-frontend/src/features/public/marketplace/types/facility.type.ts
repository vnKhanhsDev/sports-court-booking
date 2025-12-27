export interface PublicFacilitySummary {
    facilityId: number;
    facilityName: string;
    sportId: number;
    sportName: string;
    address: string;
    totalCourts: number;
    minPrice: number | null;
    maxPrice: number | null;
    imageUrls: string[];
}

export interface CourtSummary {
    courtId: number;
    courtName: string;
    courtTypeName: string;
    surfaceTypeName: string;
    imageUrls: string[];
}

export interface PublicFacilityDetail {
    facilityId: number;
    facilityName: string;
    facilityDescription: string | null;
    fullAddress: string | null;
    latitude: number | null;
    longitude: number | null;
    openingTime: string; // LocalTime as string (HH:mm:ss)
    closingTime: string; // LocalTime as string (HH:mm:ss)
    sportId: number;
    sportName: string;
    totalCourts: number;
    minPrice: number | null;
    maxPrice: number | null;
    imageUrls: string[];
    courts: CourtSummary[];
}