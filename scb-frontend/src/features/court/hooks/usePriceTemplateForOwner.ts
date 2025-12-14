import useApi from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { courtServiceForOwner } from "../services/courtService";
import type { PriceTemplateBasic } from "../types/price.types";

export default function usePriceTemplateForOwner() {
    const { execute, isLoading } = useApi();
    
    const [priceTemplates, setPriceTemplates] = useState<PriceTemplateBasic[]>([]);

    useEffect(() => {
        const fetchPriceTemplates = async () => {
            const result = await execute(() => courtServiceForOwner.getPriceTemplates());
            if (result && Array.isArray(result)) {
                setPriceTemplates(result);
            }
        };
        fetchPriceTemplates();
    }, [execute]);

    return { priceTemplates, isLoading };
}
