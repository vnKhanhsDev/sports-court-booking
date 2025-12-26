import { useState, useEffect, useMemo } from "react";
import useAddress from "@/hooks/useAddress";
import styles from "./CourtSearchFilter.module.css";
import usePublicCatalog from "@/hooks/usePublicCatalog";

interface CourtSearchFilterProps {
    onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
    sportId: number | null;
    courtTypeId: number | null;
    surfaceTypeId: number | null;
    provinceCode: string | null;
    districtCode: string | null;
    wardCode: string | null;
}

export default function CourtSearchFilter({ onFilterChange }: CourtSearchFilterProps) {
    const { catalog, catalogLoading } = usePublicCatalog();
    const { provinces, districts, wards, isLoading: addressLoading, loadDistricts, loadWards } = useAddress();

    const [selectedSportId, setSelectedSportId] = useState<string>("");
    const [selectedCourtTypeId, setSelectedCourtTypeId] = useState<string>("");
    const [selectedSurfaceTypeId, setSelectedSurfaceTypeId] = useState<string>("");
    const [selectedProvinceCode, setSelectedProvinceCode] = useState<string>("");
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>("");
    const [selectedWardCode, setSelectedWardCode] = useState<string>("");

    // Get selected sport object
    const selectedSport = useMemo(() => {
        if (!selectedSportId) return null;
        return catalog?.find(sport => sport.id === Number(selectedSportId)) || null;
    }, [catalog, selectedSportId]);

    // Get available court types and surface types based on selected sport
    const availableCourtTypes = useMemo(() => {
        if (!selectedSport) return [];
        return selectedSport.courtTypes || [];
    }, [selectedSport]);

    const availableSurfaceTypes = useMemo(() => {
        if (!selectedSport) return [];
        return selectedSport.surfaceTypes || [];
    }, [selectedSport]);

    // Load districts when province changes
    useEffect(() => {
        if (selectedProvinceCode) {
            loadDistricts(selectedProvinceCode);
            setSelectedDistrictCode("");
            setSelectedWardCode("");
        } else {
            setSelectedDistrictCode("");
            setSelectedWardCode("");
        }
    }, [selectedProvinceCode, loadDistricts]);

    // Load wards when district changes
    useEffect(() => {
        if (selectedDistrictCode) {
            loadWards(selectedDistrictCode);
            setSelectedWardCode("");
        } else {
            setSelectedWardCode("");
        }
    }, [selectedDistrictCode, loadWards]);

    // Clear court type and surface type when sport changes
    useEffect(() => {
        if (!selectedSportId) {
            setSelectedCourtTypeId("");
            setSelectedSurfaceTypeId("");
        } else {
            // Check if current selections are still valid for the new sport
            const sport = catalog?.find(s => s.id === Number(selectedSportId));
            if (sport) {
                if (selectedCourtTypeId && !sport.courtTypes?.some(ct => ct.id === Number(selectedCourtTypeId))) {
                    setSelectedCourtTypeId("");
                }
                if (selectedSurfaceTypeId && !sport.surfaceTypes?.some(st => st.id === Number(selectedSurfaceTypeId))) {
                    setSelectedSurfaceTypeId("");
                }
            }
        }
    }, [selectedSportId, catalog, selectedCourtTypeId, selectedSurfaceTypeId]);

    // Notify parent of filter changes
    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                sportId: selectedSportId ? Number(selectedSportId) : null,
                courtTypeId: selectedCourtTypeId ? Number(selectedCourtTypeId) : null,
                surfaceTypeId: selectedSurfaceTypeId ? Number(selectedSurfaceTypeId) : null,
                provinceCode: selectedProvinceCode || null,
                districtCode: selectedDistrictCode || null,
                wardCode: selectedWardCode || null,
            });
        }
    }, [selectedSportId, selectedCourtTypeId, selectedSurfaceTypeId, selectedProvinceCode, selectedDistrictCode, selectedWardCode, onFilterChange]);

    const handleClearFilters = () => {
        setSelectedSportId("");
        setSelectedCourtTypeId("");
        setSelectedSurfaceTypeId("");
        setSelectedProvinceCode("");
        setSelectedDistrictCode("");
        setSelectedWardCode("");
    };

    const hasActiveFilters = selectedSportId !== "" || 
                            selectedCourtTypeId !== "" || 
                            selectedSurfaceTypeId !== "" ||
                            selectedProvinceCode !== "" ||
                            selectedDistrictCode !== "" ||
                            selectedWardCode !== "";

    return (
        <div className={styles.filter}>
            <div className={styles.header}>
                <h2 className={styles.title}>Bộ lọc</h2>
                {hasActiveFilters && (
                    <button 
                        className={styles.clearButton}
                        onClick={handleClearFilters}
                        type="button"
                    >
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            <div className={styles.content}>
                {/* Sport Filter */}
                <div className={styles.filterSection}>
                    <h3 className={styles.sectionTitle}>Môn thể thao</h3>
                    <div className={styles.selectGroup}>
                        <select
                            value={selectedSportId}
                            onChange={(e) => setSelectedSportId(e.target.value)}
                            className={styles.select}
                            disabled={catalogLoading}
                        >
                            <option value="">Chọn môn thể thao</option>
                            {catalogLoading ? (
                                <option disabled>Đang tải...</option>
                            ) : (
                                catalog?.map(sport => (
                                    <option key={sport.id} value={sport.id}>
                                        {sport.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                {/* Court Type Filter */}
                {selectedSportId && (
                    <div className={styles.filterSection}>
                        <h3 className={styles.sectionTitle}>Loại sân</h3>
                        <div className={styles.selectGroup}>
                            <select
                                value={selectedCourtTypeId}
                                onChange={(e) => setSelectedCourtTypeId(e.target.value)}
                                className={styles.select}
                                disabled={availableCourtTypes.length === 0}
                            >
                                <option value="">Chọn loại sân</option>
                                {availableCourtTypes.length === 0 ? (
                                    <option disabled>Không có loại sân nào</option>
                                ) : (
                                    availableCourtTypes.map(courtType => (
                                        <option key={courtType.id} value={courtType.id}>
                                            {courtType.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>
                )}

                {/* Surface Type Filter */}
                {selectedSportId && (
                    <div className={styles.filterSection}>
                        <h3 className={styles.sectionTitle}>Loại mặt sân</h3>
                        <div className={styles.selectGroup}>
                            <select
                                value={selectedSurfaceTypeId}
                                onChange={(e) => setSelectedSurfaceTypeId(e.target.value)}
                                className={styles.select}
                                disabled={availableSurfaceTypes.length === 0}
                            >
                                <option value="">Chọn loại mặt sân</option>
                                {availableSurfaceTypes.length === 0 ? (
                                    <option disabled>Không có loại mặt sân nào</option>
                                ) : (
                                    availableSurfaceTypes.map(surfaceType => (
                                        <option key={surfaceType.id} value={surfaceType.id}>
                                            {surfaceType.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>
                )}

                {/* Location Filter */}
                <div className={styles.filterSection}>
                    <h3 className={styles.sectionTitle}>Vị trí</h3>
                    
                    {/* Province */}
                    <div className={styles.selectGroup}>
                        <label className={styles.selectLabel}>Tỉnh/Thành phố</label>
                        <select
                            value={selectedProvinceCode}
                            onChange={(e) => setSelectedProvinceCode(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">Chọn tỉnh/thành phố</option>
                            {addressLoading ? (
                                <option disabled>Đang tải...</option>
                            ) : (
                                provinces.map(province => (
                                    <option key={province.code} value={province.code}>
                                        {province.name}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* District */}
                    {selectedProvinceCode && (
                        <div className={styles.selectGroup}>
                            <label className={styles.selectLabel}>Quận/Huyện</label>
                            <select
                                value={selectedDistrictCode}
                                onChange={(e) => setSelectedDistrictCode(e.target.value)}
                                className={styles.select}
                                disabled={districts.length === 0}
                            >
                                <option value="">Chọn quận/huyện</option>
                                {addressLoading ? (
                                    <option disabled>Đang tải...</option>
                                ) : (
                                    districts.map(district => (
                                        <option key={district.code} value={district.code}>
                                            {district.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    )}

                    {/* Ward */}
                    {selectedDistrictCode && (
                        <div className={styles.selectGroup}>
                            <label className={styles.selectLabel}>Phường/Xã/Thị trấn</label>
                            <select
                                value={selectedWardCode}
                                onChange={(e) => setSelectedWardCode(e.target.value)}
                                className={styles.select}
                                disabled={wards.length === 0}
                            >
                                <option value="">Chọn phường/xã/thị trấn</option>
                                {addressLoading ? (
                                    <option disabled>Đang tải...</option>
                                ) : (
                                    wards.map(ward => (
                                        <option key={ward.code} value={ward.code}>
                                            {ward.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}