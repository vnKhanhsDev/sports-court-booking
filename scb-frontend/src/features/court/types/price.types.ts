export interface PriceTemplateBasic {
    id: number;
    facilityName: string | null;
    sportName: string | null;
    name: string;
    version: number;
    isActive: boolean;
}

export interface PriceTemplateItem {
    id: number;
    startTime: string;
    endTime: string;
    price: number;
}

export interface PriceTemplateDetail {
    id: number;
    facilityName: string | null;
    sportName: string | null;
    name: string;
    version: number;
    isActive: boolean;
    items: PriceTemplateItem[];
}