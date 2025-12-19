export interface PriceListSummary {
    id: number;
    name: string;
    version: number;
    appliedCourtCount: number;
    isActive: boolean;
}

export interface PriceListOption {
    id: number;
    facilityId: number | null;
    sportId: number | null;
    courtTypeId: number | null;
    surfaceTypeId: number | null;
    name: string;
}

export interface PriceListDetail {
    id: number;
    facilityId: number | null;
    sportId: number | null;
    courtTypeId: number | null;
    surfaceTypeId: number | null;
    name: string;
    note: string | null;
    version: number;
    isActive: boolean;
    slots: PriceSlot[];
}

export interface PriceListUpsert {
    facilityId: number | null;
    sportId: number | null;
    courtTypeId: number | null;
    surfaceTypeId: number | null;
    name: string;
    note: string | null;
    isActive: boolean;
    slots: PriceSlot[];
}

export interface PriceSlot {
    fromTime: string;
    toTime: string;
    price: number;
}