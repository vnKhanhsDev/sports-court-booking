import { useState, useEffect, useRef } from 'react';
import { CourtOutlined, Search } from '@/components/ui/icons';
import useAddress from '@/hooks/useAddress';
import styles from './CourtSearch.module.css';

const CourtSearch = () => {
    const { provinces, districts, isLoading, loadDistricts } = useAddress();
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
    const [isProvinceListOpen, setIsProvinceListOpen] = useState(false);
    const [isDistrictListOpen, setIsDistrictListOpen] = useState(false);
    const areaDropdownRef = useRef<HTMLDivElement>(null);
    const provinceListRef = useRef<HTMLDivElement>(null);
    const districtListRef = useRef<HTMLDivElement>(null);

    // Load districts when province is selected
    useEffect(() => {
        if (selectedProvince) {
            loadDistricts(selectedProvince);
            setSelectedDistrict(''); // Reset district when province changes
        } else {
            setSelectedDistrict('');
        }
    }, [selectedProvince, loadDistricts]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target as Node)) {
                setIsAreaDropdownOpen(false);
                setIsProvinceListOpen(false);
                setIsDistrictListOpen(false);
            }
            if (provinceListRef.current && !provinceListRef.current.contains(event.target as Node)) {
                setIsProvinceListOpen(false);
            }
            if (districtListRef.current && !districtListRef.current.contains(event.target as Node)) {
                setIsDistrictListOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getAreaDisplayText = () => {
        if (selectedDistrict && districts.length > 0) {
            const district = districts.find(d => d.code === selectedDistrict);
            if (district) {
                const province = provinces.find(p => p.code === selectedProvince);
                return province ? `${district.name}, ${province.name}` : district.name;
            }
        }
        if (selectedProvince && provinces.length > 0) {
            const province = provinces.find(p => p.code === selectedProvince);
            return province ? province.name : 'Chọn khu vực';
        }
        return 'Chọn khu vực';
    };

    const getProvinceDisplayText = () => {
        if (selectedProvince && provinces.length > 0) {
            const province = provinces.find(p => p.code === selectedProvince);
            return province ? province.name : 'Chọn tỉnh/thành phố';
        }
        return 'Chọn tỉnh/thành phố';
    };

    const getDistrictDisplayText = () => {
        if (!selectedProvince) {
            return 'Chọn quận/huyện';
        }
        if (selectedDistrict && districts.length > 0) {
            const district = districts.find(d => d.code === selectedDistrict);
            return district ? district.name : 'Chọn quận/huyện';
        }
        return 'Chọn quận/huyện';
    };

    const handleProvinceSelect = (provinceCode: string) => {
        setSelectedProvince(provinceCode);
        setSelectedDistrict(''); // Reset district when province changes
        setIsProvinceListOpen(false);
    };

    const handleDistrictSelect = (districtCode: string) => {
        setSelectedDistrict(districtCode);
        setIsDistrictListOpen(false);
    };

    const handleReset = () => {
        setSelectedProvince('');
        setSelectedDistrict('');
        setIsAreaDropdownOpen(false);
    };

    return (
        <div className={styles.courtSearch}>
            {/* Category Button */}
            <button className={styles.categoryButton} type="button">
                <CourtOutlined className={styles.categoryIcon} />
                <span>Danh mục sân</span>
            </button>

            {/* Search Input */}
            <div className={styles.searchInputWrapper}>
                <Search className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Tìm sân thể thao"
                    className={styles.searchInput}
                />
            </div>

            {/* Separator */}
            <div className={styles.separator}></div>

            {/* Area Selection - Compact Single Dropdown */}
            <div className={styles.areaSelection} ref={areaDropdownRef}>
                <label className={styles.filterLabel}>Khu vực</label>
                <button
                    className={styles.areaTriggerButton}
                    type="button"
                    onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                    disabled={isLoading}
                >
                    <span className={styles.areaTriggerValue} title={getAreaDisplayText()}>
                        {getAreaDisplayText()}
                    </span>
                    <svg
                        className={`${styles.chevronIcon} ${isAreaDropdownOpen ? styles.chevronOpen : ''}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>

                {/* Area Dropdown Menu */}
                {isAreaDropdownOpen && (
                    <div className={styles.areaDropdownMenu}>
                        {/* Province Selection Field */}
                        <div className={styles.areaSelectField} ref={provinceListRef}>
                            <button
                                className={styles.areaSelectButton}
                                type="button"
                                onClick={() => {
                                    setIsProvinceListOpen(!isProvinceListOpen);
                                    setIsDistrictListOpen(false);
                                }}
                            >
                                <span className={styles.areaSelectValue}>
                                    {getProvinceDisplayText()}
                                </span>
                                <svg
                                    className={`${styles.chevronIcon} ${isProvinceListOpen ? styles.chevronOpen : ''}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {/* Province List */}
                            {isProvinceListOpen && (
                                <div className={styles.areaSelectList}>
                                    {isLoading ? (
                                        <div className={styles.loadingText}>Đang tải...</div>
                                    ) : provinces.length > 0 ? (
                                        provinces.map((province) => (
                                            <button
                                                key={province.code}
                                                type="button"
                                                className={`${styles.areaSelectOption} ${selectedProvince === province.code ? styles.areaSelectOptionActive : ''}`}
                                                onClick={() => handleProvinceSelect(province.code)}
                                            >
                                                {province.name}
                                            </button>
                                        ))
                                    ) : (
                                        <div className={styles.emptyText}>Không có dữ liệu</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* District Selection Field */}
                        <div className={styles.areaSelectField} ref={districtListRef}>
                            <button
                                className={styles.areaSelectButton}
                                type="button"
                                onClick={() => {
                                    if (selectedProvince) {
                                        setIsDistrictListOpen(!isDistrictListOpen);
                                        setIsProvinceListOpen(false);
                                    }
                                }}
                                disabled={!selectedProvince}
                            >
                                <span className={styles.areaSelectValue}>
                                    {getDistrictDisplayText()}
                                </span>
                                <svg
                                    className={`${styles.chevronIcon} ${isDistrictListOpen ? styles.chevronOpen : ''}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {/* District List */}
                            {isDistrictListOpen && selectedProvince && (
                                <div className={styles.areaSelectList}>
                                    {districts.length > 0 ? (
                                        districts.map((district) => (
                                            <button
                                                key={district.code}
                                                type="button"
                                                className={`${styles.areaSelectOption} ${selectedDistrict === district.code ? styles.areaSelectOptionActive : ''}`}
                                                onClick={() => handleDistrictSelect(district.code)}
                                            >
                                                {district.name}
                                            </button>
                                        ))
                                    ) : (
                                        <div className={styles.emptyText}>Không có dữ liệu</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Reset Button */}
                        {(selectedProvince || selectedDistrict) && (
                            <button
                                className={styles.resetButton}
                                type="button"
                                onClick={handleReset}
                            >
                                Đặt lại
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Separator */}
            <div className={styles.separator}></div>

            {/* Search Button */}
            <button className={styles.searchButton} type="button">
                Tìm sân
            </button>
        </div>
    );
};

export default CourtSearch;

