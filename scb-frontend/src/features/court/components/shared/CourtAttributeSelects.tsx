import { useMemo } from "react";
import { Select } from "@/components/form";
import type { FacilityBasicForOwner } from "../../types/facility.types";
import type { SportPublicResponse } from "@/types/catalog.types";
import styles from "./CourtAttributeSelects.module.css";

export interface CourtAttributeSelectsValues {
    facilityId?: string;
    sportId?: string;
    courtTypeId?: string;
    surfaceTypeId?: string;
}

export interface CourtAttributeSelectsErrors {
    facilityId?: string;
    sportId?: string;
    courtTypeId?: string;
    surfaceTypeId?: string;
}

export interface CourtAttributeSelectsProps {
    facilities: FacilityBasicForOwner[];
    catalog: SportPublicResponse[];
    values: CourtAttributeSelectsValues;
    onChange: (field: keyof CourtAttributeSelectsValues, value: string) => void;
    errors?: CourtAttributeSelectsErrors;
    showFields?: {
        facility?: boolean;
        sport?: boolean;
        courtType?: boolean;
        surfaceType?: boolean;
    };
    required?: {
        facility?: boolean;
        sport?: boolean;
        courtType?: boolean;
        surfaceType?: boolean;
    };
    disabled?: {
        facility?: boolean;
        sport?: boolean;
        courtType?: boolean;
        surfaceType?: boolean;
    };
    isLoading?: {
        catalog?: boolean;
    };
    layout?: "vertical" | "grid";
    className?: string;
}

export default function CourtAttributeSelects({
    facilities,
    catalog,
    values,
    onChange,
    errors = {},
    showFields = {
        facility: true,
        sport: true,
        courtType: true,
        surfaceType: true,
    },
    required = {
        facility: true,
        sport: true,
        courtType: true,
        surfaceType: true,
    },
    disabled = {},
    isLoading = {},
    layout = "grid",
    className,
}: CourtAttributeSelectsProps) {
    const selectedSport = useMemo(() => {
        if (!values.sportId) return null;
        return catalog.find((sport) => sport.id.toString() === values.sportId) || null;
    }, [catalog, values.sportId]);

    const handleFacilityChange = (value: string) => {
        onChange("facilityId", value);
    };

    const handleSportChange = (value: string) => {
        onChange("sportId", value);
        // Reset dependent fields when sport changes
        if (showFields.courtType) {
            onChange("courtTypeId", "");
        }
        if (showFields.surfaceType) {
            onChange("surfaceTypeId", "");
        }
    };

    const handleCourtTypeChange = (value: string) => {
        onChange("courtTypeId", value);
    };

    const handleSurfaceTypeChange = (value: string) => {
        onChange("surfaceTypeId", value);
    };

    const containerClass = layout === "grid" ? styles.gridContainer : styles.verticalContainer;

    return (
        <div className={`${containerClass} ${className || ""}`}>
            {showFields.facility && (
                <div className={styles.facilityField}>
                    <Select
                        label="Cơ sở"
                        required={required.facility}
                        placeholder="-- Chọn cơ sở --"
                        value={values.facilityId || ""}
                        onChange={handleFacilityChange}
                        options={facilities.map((facility) => ({
                            value: facility.id.toString(),
                            label: facility.name,
                        }))}
                        disabled={disabled.facility}
                        error={errors.facilityId}
                        name="facility"
                    />
                </div>
            )}

            {showFields.sport && (
                <div className={styles.sportField}>
                    <Select
                        label="Môn thể thao"
                        required={required.sport}
                        placeholder="-- Chọn môn thể thao --"
                        value={values.sportId || ""}
                        onChange={handleSportChange}
                        options={catalog.map((sport) => ({
                            value: sport.id.toString(),
                            label: sport.name,
                        }))}
                        disabled={disabled.sport || isLoading.catalog}
                        error={errors.sportId}
                        name="sport"
                    />
                </div>
            )}

            {showFields.courtType && (
                <div className={styles.courtTypeField}>
                    <Select
                        label="Loại sân"
                        required={required.courtType}
                        placeholder="-- Chọn loại sân --"
                        value={values.courtTypeId || ""}
                        onChange={handleCourtTypeChange}
                        options={
                            selectedSport?.courtTypes.map((courtType) => ({
                                value: courtType.id.toString(),
                                label: courtType.name,
                            })) || []
                        }
                        disabled={disabled.courtType || !values.sportId}
                        error={errors.courtTypeId}
                        name="courtType"
                    />
                </div>
            )}

            {showFields.surfaceType && (
                <div className={styles.surfaceTypeField}>
                    <Select
                        label="Loại mặt sân"
                        required={required.surfaceType}
                        placeholder="-- Chọn loại mặt sân --"
                        value={values.surfaceTypeId || ""}
                        onChange={handleSurfaceTypeChange}
                        options={
                            selectedSport?.surfaceTypes.map((surfaceType) => ({
                                value: surfaceType.id.toString(),
                                label: surfaceType.name,
                            })) || []
                        }
                        disabled={disabled.surfaceType || !values.sportId}
                        error={errors.surfaceTypeId}
                        name="surfaceType"
                    />
                </div>
            )}
        </div>
    );
}
