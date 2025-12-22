export interface PublicFacility {
    facilityId: number;
    sportId: number;
    facilityName: string;
    sportName: string;
    address: string;
    totalCourts: number;
    minPrice: number | null;
    maxPrice: number | null;
    imageUrls: string[];
}