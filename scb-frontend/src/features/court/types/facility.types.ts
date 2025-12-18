import type { CourtBasicForOwner } from "./court.types";

export type FacilityStatus = 'PENDING' | 'REJECTED' | 'LOCKED' | 'ACTIVE' | 'MAINTENANCE' | 'CLOSED';

export interface FacilityBasicForOwner {
    id: number;
    name: string;
    openingTime: string;
    closingTime: string;
    status: string;
    address: string;
    courts: CourtBasicForOwner[];
}

export interface OwnerFacilitySummary {
    id: number;
    name: string;
    openingTime: string;
    closingTime: string;
    status: string;
    address: string;
    totalCourts: number;
}

export interface FacilityDetail {
    name: string;
    description: string | null;
    openingTime: string;
    closingTime: string;
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    addressDetail: string;
    geoLatitude: number | null;
    geoLongitude: number | null;
    status: string;
}

export interface FacilityCreation {
    name: string;
    description: string | null;
    openingTime: string;
    closingTime: string;
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    addressDetail: string;
    geoLatitude: number | null;
    geoLongitude: number | null;
}

export interface FacilityUpdation {
    name: string;
    description: string | null;
    openingTime: string;
    closingTime: string;
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    addressDetail: string;
    geoLatitude: number | null;
    geoLongitude: number | null;
    status: string;
}