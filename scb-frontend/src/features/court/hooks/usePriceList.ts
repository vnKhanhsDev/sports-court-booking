import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import { priceListService } from "../services/priceListService";
import type {
    PriceListOption,
    PriceListUpsert,
    PriceListSummary,
} from "../types/price.types";

export default function usePriceList() {
    const { execute, isLoading: isPriceListsLoading } = useApi();

    const [priceLists, setPriceLists] = useState<PriceListSummary[]>([]);

    const [priceListOptions, setPriceListOptions] = useState<PriceListOption[]>([]);

    const fetchPriceLists = useCallback(async () => {
        const result = await execute(() => priceListService.getAllPriceLists());
        if (result && Array.isArray(result)) {
            setPriceLists(result);
        }
    }, [execute]);

    const fetchPriceListOptions = useCallback(async () => {
        const result = await execute(() => priceListService.getPriceListOptions());
        if (result && Array.isArray(result)) {
            setPriceListOptions(result);
        }
    }, [execute]);

    useEffect(() => {
        fetchPriceLists();
    }, [fetchPriceLists]);

    useEffect(() => {
        fetchPriceListOptions();
    }, [fetchPriceListOptions]);

    const createPriceList = useCallback(
        async (payload: PriceListUpsert) => {
            const result = await execute(() => priceListService.createPriceList(payload));
            if (result && Array.isArray(result)) {
                setPriceLists(result);
            }
        },
        [execute]
    );

    const updatePriceList = useCallback(
        async (id: number, payload: PriceListUpsert) => {
            const result = await execute(() => priceListService.updatePriceList(id, payload));
            if (result && Array.isArray(result)) {
                setPriceLists(result);
            }
        },
        [execute]
    );

    const deletePriceList = useCallback(
        async (id: number) => {
            const result = await execute(() => priceListService.deletePriceList(id));
            if (result && Array.isArray(result)) {
                setPriceLists(result);
            } else if (result && typeof result === 'object' && 'success' in result && !result.success) {
                // If result is an error response, throw it so the caller can handle it
                throw result;
            } else {
                // Unexpected result format
                throw new Error("Unexpected response format");
            }
        },
        [execute]
    );

    return {
        priceLists,
        priceListOptions,
        isPriceListsLoading,
        createPriceList,
        updatePriceList,
        deletePriceList,
        refetch: fetchPriceLists,
    };
}
