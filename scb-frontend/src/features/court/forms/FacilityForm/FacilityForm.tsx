import { useState } from "react";
import { Opening, Closing } from "@/components/ui/icons";
import styles from "./FacilityForm.module.css";

interface FacilityFormProps {
    onSubmit?: (data: FacilityFormData) => void;
    initialData?: Partial<FacilityFormData>;
}

export interface FacilityFormData {
    name: string;
    description: string;
    address: string;
    openingTime: string;
    closingTime: string;
    geoLatitude?: number;
    geoLongitude?: number;
}

export default function FacilityForm({ onSubmit, initialData }: FacilityFormProps) {
    const [formData, setFormData] = useState<FacilityFormData>({
        name: initialData?.name || "",
        description: initialData?.description || "",
        address: initialData?.address || "",
        openingTime: initialData?.openingTime || "06:00",
        closingTime: initialData?.closingTime || "22:00",
        geoLatitude: initialData?.geoLatitude,
        geoLongitude: initialData?.geoLongitude,
    });

    const handleChange = (field: keyof FacilityFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.label}>
                    Địa chỉ <span className={styles.required}>*</span>
                </label>
                <input
                    id="address"
                    type="text"
                    className={styles.input}
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Nhập địa chỉ cơ sở"
                    required
                />
            </div>

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
