import { useEffect, useState } from "react";
import { Opening, Closing } from "@/components/ui/icons";
import styles from "./FacilityForm.module.css";
import useAddress from "@/hooks/useAddress";
import type { FacilityStatus } from "../../types/facility.types";

interface FacilityFormProps {
    onSubmit?: (data: FacilityFormData) => void;
    initialData?: Partial<FacilityFormData>;
    readOnly?: boolean;
}

export interface FacilityFormData {
    name: string;
    description: string;
    address: string; // chi tiết địa chỉ (số nhà, đường)
    openingTime: string;
    closingTime: string;
    geoLatitude?: number;
    geoLongitude?: number;
    provinceCode?: string;
    districtCode?: string;
    wardCode?: string;
    status?: FacilityStatus;
}

export default function FacilityForm({ onSubmit, initialData, readOnly = false }: FacilityFormProps) {
    const { provinces, districts, wards, isLoading, loadDistricts, loadWards } = useAddress();

    const [formData, setFormData] = useState<FacilityFormData>({
        name: initialData?.name || "",
        description: initialData?.description || "",
        address: initialData?.address || "",
        openingTime: initialData?.openingTime || "06:00",
        closingTime: initialData?.closingTime || "22:00",
        geoLatitude: initialData?.geoLatitude,
        geoLongitude: initialData?.geoLongitude,
        provinceCode: initialData?.provinceCode,
        districtCode: initialData?.districtCode,
        wardCode: initialData?.wardCode,
        status: initialData?.status,
    });

    // Load districts / wards if initial codes are provided (e.g. view / edit mode)
    useEffect(() => {
        if (initialData?.provinceCode) {
            loadDistricts(initialData.provinceCode);
        }
    }, [initialData?.provinceCode, loadDistricts]);

    useEffect(() => {
        if (initialData?.districtCode) {
            loadWards(initialData.districtCode);
        }
    }, [initialData?.districtCode, loadWards]);

    const handleChange = (field: keyof FacilityFormData, value: string | number | undefined) => {
        if (readOnly) return;
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceCode = e.target.value || undefined;
        handleChange("provinceCode", provinceCode);
        // reset lower levels
        handleChange("districtCode", undefined);
        handleChange("wardCode", undefined);
        loadDistricts(provinceCode || "");
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtCode = e.target.value || undefined;
        handleChange("districtCode", districtCode);
        // reset ward
        handleChange("wardCode", undefined);
        loadWards(districtCode || "");
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardCode = e.target.value || undefined;
        handleChange("wardCode", wardCode);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (readOnly) return;
        onSubmit?.(formData);
    };

    // Generate time options (00:00 to 23:00)
    const generateTimeOptions = () => {
        const options: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            options.push(timeString);
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

    // ----- Status helpers -----
    const getStatusLabel = (status?: FacilityStatus) => {
        switch (status) {
            case "PENDING":
                return "Chờ duyệt";
            case "REJECTED":
                return "Bị từ chối";
            case "LOCKED":
                return "Đã khóa";
            case "ACTIVE":
                return "Đang hoạt động";
            case "MAINTENANCE":
                return "Bảo trì";
            case "CLOSED":
                return "Đã đóng";
            default:
                return "Không xác định";
        }
    };

    const forbiddenStatuses: FacilityStatus[] = ["PENDING", "REJECTED", "LOCKED", "CLOSED"];
    const isStatusEditable =
        !readOnly && formData.status !== undefined && !forbiddenStatuses.includes(formData.status);

    // Owner can only transition between MAINTENANCE, CLOSED, ACTIVE (with constraints)
    let allowedStatusOptions: FacilityStatus[] = ["MAINTENANCE", "CLOSED"];
    if (formData.status === "MAINTENANCE") {
        // Only when current is MAINTENANCE can owner select ACTIVE
        allowedStatusOptions.push("ACTIVE");
    }
    // Ensure current value is present so the select shows correctly
    if (formData.status && !allowedStatusOptions.includes(formData.status)) {
        allowedStatusOptions = [formData.status, ...allowedStatusOptions];
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                    Tên cơ sở <span className={styles.required}>*</span>
                </label>
                <input
                    id="name"
                    type="text"
                    className={styles.input}
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Nhập tên cơ sở"
                    required
                    disabled={readOnly}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>
                    Mô tả
                </label>
                <textarea
                    id="description"
                    className={styles.textarea}
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Nhập mô tả về cơ sở"
                    rows={4}
                    disabled={readOnly}
                />
            </div>

            {/* Địa chỉ hành chính: Tỉnh / Huyện / Xã */}
            <div className={styles.addressRow}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Tỉnh / Thành phố</label>
                    <select
                        className={styles.select}
                        value={formData.provinceCode || ""}
                        onChange={handleProvinceChange}
                        disabled={readOnly || (isLoading && provinces.length === 0)}
                    >
                        <option value="">Chọn tỉnh / thành phố</option>
                        {provinces.map((p) => (
                            <option key={p.code} value={p.code}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Quận / Huyện</label>
                    <select
                        className={styles.select}
                        value={formData.districtCode || ""}
                        onChange={handleDistrictChange}
                        disabled={readOnly || !formData.provinceCode || districts.length === 0}
                    >
                        <option value="">Chọn quận / huyện</option>
                        {districts.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Phường / Xã</label>
                    <select
                        className={styles.select}
                        value={formData.wardCode || ""}
                        onChange={handleWardChange}
                        disabled={readOnly || !formData.districtCode || wards.length === 0}
                    >
                        <option value="">Chọn phường / xã</option>
                        {wards.map((w) => (
                            <option key={w.code} value={w.code}>
                                {w.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Địa chỉ chi tiết */}
            <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.label}>
                    Địa chỉ chi tiết <span className={styles.required}>*</span>
                </label>
                <input
                    id="address"
                    type="text"
                    className={styles.input}
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Số nhà, tên đường..."
                    required
                    disabled={readOnly}
                />
            </div>

            {/* Trạng thái cơ sở */}
            {formData.status && (
                <div className={styles.formGroup}>
                    <label className={styles.label}>Trạng thái cơ sở</label>
                    {isStatusEditable ? (
                        <select
                            className={styles.select}
                            value={formData.status}
                            onChange={(e) => handleChange("status", e.target.value as FacilityStatus)}
                        >
                            {allowedStatusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {getStatusLabel(status)}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            className={styles.input}
                            value={getStatusLabel(formData.status)}
                            readOnly
                            disabled
                        />
                    )}
                </div>
            )}

            <div className={styles.timeRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="openingTime" className={styles.label}>
                        Giờ mở cửa <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.timeInputWrapper}>
                        <Opening className={styles.timeIcon} />
                        <select
                            id="openingTime"
                            className={styles.select}
                            value={formData.openingTime}
                            onChange={(e) => handleChange("openingTime", e.target.value)}
                            required
                            disabled={readOnly}
                        >
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="closingTime" className={styles.label}>
                        Giờ đóng cửa <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.timeInputWrapper}>
                        <Closing className={styles.timeIcon} />
                        <select
                            id="closingTime"
                            className={styles.select}
                            value={formData.closingTime}
                            onChange={(e) => handleChange("closingTime", e.target.value)}
                            required
                            disabled={readOnly}
                        >
                            {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </form>
    );
}
