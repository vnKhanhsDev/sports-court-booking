import { useCallback, useEffect, useState } from "react";
import useApi from "./useApi";
import type { Province, District, Ward } from "@/types/address.types";
import { addressService } from "@/services/addressService";

export default function useAddress() {
    const { execute, isLoading } = useApi();

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);

    useEffect(() => {
        const fetchProvinces = async () => {
            const result = await execute(() => addressService.getAllProvinces());
            if (result && Array.isArray(result)) {
                setProvinces(result);
            }
        };
        fetchProvinces();
    }, [execute]);

    const loadDistricts = useCallback(async (provinceCode: string) => {
        if (!provinceCode) {
            setDistricts([]);
            setWards([]);
            return;
        }

        const result = await execute(() => addressService.getAllDistrictsByProvinceCode(provinceCode));
        if (result && Array.isArray(result)) {
            setDistricts(result);
            setWards([]);
        }
    }, [execute]);

    const loadWards = useCallback(async (districtCode: string) => {
        if (!districtCode) {
            setWards([]);
            return;
        }

        const result = await execute(() => addressService.getAllWardsByDistrictCode(districtCode));
        if (result && Array.isArray(result)) {
            setWards(result);
        }
    }, [execute]);

    return {
        provinces,
        districts,
        wards,
        isLoading,
        loadDistricts,
        loadWards,
    };
}
