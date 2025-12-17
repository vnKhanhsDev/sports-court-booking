export interface FacilityOption {
    id: number;
    name: string;
}

export interface CourtBasicForOwner {
    id: number;
    facilityName: string;
    sportName: string;
    courtTypeName: string;
    name: string;
    status: string;
    isBooked: boolean;
}