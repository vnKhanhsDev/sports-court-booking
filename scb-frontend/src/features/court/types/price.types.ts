export interface PriceTemplateSummary {
    id: number;
    name: string;
    version: number;
    appliedCourtCount: number;
    isActive: boolean;
}

export interface PriceTemplateOption {
    id: number;
    facilityId: number | null;
    sportId: number | null;
    courtTypeId: number | null;
    surfaceTypeId: number | null;
    name: string;
}

export interface PriceTemplateDetail {
    id: number;
    facilityId: number | null;
    sportId: number | null;
    courtTypeId: number | null;
    surfaceTypeId: number | null;
    name: string;
    description: string | null;
    version: number;
    isActive: boolean;
    items: PriceTemplateItem[];
}

export interface PriceTemplateUpsert {
    facilityId: number | null;
    sportId: number | null;
    courtTypeId: number | null;
    surfaceTypeId: number | null;
    name: string;
    description: string | null;
    isActive: boolean;
    items: PriceTemplateItem[];
}

export interface PriceTemplateItem {
    startTime: string;
    endTime: string;
    price: number;
}