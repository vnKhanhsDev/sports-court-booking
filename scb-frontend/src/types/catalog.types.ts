export interface PublicSport {
    id: number;
    name: string;
    iconUrl: string;
    imageUrl: string;
    courtTypes?: PublicCourtType[];
    surfaceTypes?: PublicSurfaceType[];
}

export interface PublicCourtType {
    id: number;
    name: string;
}

export interface PublicSurfaceType {
    id: number;
    name: string;
}