export interface SurfaceTypePublicResponse {
    id: number;
    name: string;
}

export interface CourtTypePublicResponse {
    id: number;
    name: string;
}

export interface SportPublicResponse {
    id: number;
    name: string;
    courtTypes: CourtTypePublicResponse[];
    surfaceTypes: SurfaceTypePublicResponse[];
}

