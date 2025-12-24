import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '@/services/catalogService';
import type { PublicSport } from '@/types/catalog.types';
import { fetchProvinces, fetchDistrictsByProvinceCode } from '@/services/address.service';
import type { Province, District } from '@/types/address.types';
import { Search } from '@/components/ui/icons';
import styles from './CourtSearch.module.css';

const CourtSearch = () => {
    const [selectedCatalogIds, setSelectedCatalogIds] = useState<number[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedArea, setSelectedArea] = useState<string>('');

    const { data: catalog = [], isLoading: catalogLoading } = useQuery<PublicSport[]>({
        queryKey: ['catalog'],
        queryFn: () => catalogService.getPublicCatalog(),
        staleTime: 1000 * 60 * 5, // cache for 5 minutes
    });

    const { data: provinces = [], isLoading: provincesLoading } = useQuery<Province[]>({
        queryKey: ['provinces'],
        queryFn: () => fetchProvinces(),
    });

    const { data: districts = [], isLoading: districtsLoading } = useQuery<District[]>({
        queryKey: ['districts', selectedProvince],
        enabled: !!selectedProvince,
        queryFn: () => fetchDistrictsByProvinceCode(selectedProvince),
    });
    
    const handleCatalogToggle = (sportId: number) => {
        setSelectedCatalogIds((prev) =>
            prev.includes(sportId)
                ? prev.filter((id) => id !== sportId)
                : [...prev, sportId]
        );
    };

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceCode = e.target.value;
        setSelectedProvince(provinceCode);
        setSelectedDistrict('');

        const province = provinces.find((item) => item.code === provinceCode);
        setSelectedArea(province ? province.name : '');
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtCode = e.target.value;
        setSelectedDistrict(districtCode);

        const district = districts.find((item) => item.code === districtCode);
        const province = provinces.find((item) => item.code === selectedProvince);

        if (district && province) {
            setSelectedArea(`${district.name}, ${province.name}`);
        } else if (district) {
            setSelectedArea(district.name);
        }
    }
    

    return (
        <form className={styles.searchBar}>
            {/* Catalog Dropdown */}
            <div className={styles.catalogDropdown}>
                <div className={styles.label}>
                    <span>Danh mục sân</span>
                </div>

                {!catalogLoading && (
                    <div className={styles.options}>
                        {catalog.map((sport) => (
                            <label key={sport.id} className={styles.option}>
                                <input
                                    type="checkbox"
                                    checked={selectedCatalogIds.includes(sport.id)}
                                    onChange={() => handleCatalogToggle(sport.id)}
                                    className={styles.checkbox}
                                />
                                <span>{sport.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Area Selection*/}
            <div className={styles.areaSelection}>
                <div className={styles.selected}>
                    <p>Khu vực</p>
                    <span>{selectedArea || '-- Chọn khu vực --'}</span>
                </div>

                <div className={styles.dropdown}>
                    <select
                        name="province"
                        id="province"
                        value={selectedProvince}
                        onChange={handleProvinceChange}
                        className={styles.select}
                    >
                        <option value="" disabled>Chọn tỉnh/thành phố</option>
                        {!provincesLoading && provinces.map((province) => (
                            <option key={province.code} value={province.code}>
                                {province.name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="district"
                        id="district"
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                        disabled={!selectedProvince || districtsLoading}
                        className={styles.select}
                    >
                        <option value="" disabled>Chọn quận/huyện</option>
                        {!districtsLoading && districts.map((district) => (
                            <option key={district.code} value={district.code}>
                                {district.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Tìm sân thể thao"
                className={styles.searchInput}
            />

            {/* Search Button */}
            <button className={styles.searchButton} type="button">
                <Search className={styles.searchIcon} />
            </button>
        </form>
    );
};

export default CourtSearch;

