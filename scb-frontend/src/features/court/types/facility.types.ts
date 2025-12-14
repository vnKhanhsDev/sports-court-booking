import type { CourtBasicForOwner } from "./court.types";

export interface FacilityBasicForOwner {
    id: number;
    name: string;
    openingTime: string;
    closingTime: string;
    status: string;
    address: string;
    courts: CourtBasicForOwner[];
}