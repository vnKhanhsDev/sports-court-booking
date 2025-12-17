import { useMemo } from "react";
import { Select } from "@/components/form";
import type { SportPublicResponse } from "@/types/catalog.types";
import styles from "./CourtAttributeSection.module.css";
import clsx from "clsx";
import type { FacilityOption } from "@/features/court/types/court.types";

export interface CourtAttributeValues {
    facilityId?: string;
    sportId?: string;
    courtTypeId?: string;
    surfaceTypeId?: string;
}

export interface CourtAttributeErrors {
    facilityId?: string;
    sportId?: string;
    courtTypeId?: string;
    surfaceTypeId?: string;
}

export interface CourtAttributeSectionProps {
    facilities: FacilityOption[];
    catalog: SportPublicResponse[];
    values: CourtAttributeValues;
    onChange: (field: keyof CourtAttributeValues, value: string) => void;
    errors?: CourtAttributeErrors;
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
    className?: string;
}

export default function CourtAttributeSection({
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
    className,
}: CourtAttributeSectionProps) {
    const selectedSport = useMemo(() => {
        if (!values.sportId) return null;
        return catalog.find((sport) => sport.id.toString() === values.sportId) || null;
    }, [catalog, values.sportId]);

    const handleFacilityChange = (value: string) => {
        onChange("facilityId", value);
    };

    const handleSportChange = (value: string) => {
        onChange("sportId", value);
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

    return (
        <section className={clsx(styles.section, className)}>
            <div className={styles.content}>
                <div className={styles.gridContainer}>
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
            </div>
        </section>
    );
}
