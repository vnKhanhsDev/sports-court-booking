import { useCallback, useEffect, useState } from "react";
import useApi from "@/hooks/useApi";
import { priceTemplateService } from "../services/priceTemplateService";
import type {
    PriceTemplateOption,
    PriceTemplateUpsert,
    PriceTemplateSummary,
} from "../types/price.types";

export default function usePriceTemplate() {
    const { execute, isLoading: isTemplatesLoading } = useApi();

    const [priceTemplates, setPriceTemplates] = useState<PriceTemplateSummary[]>([]);

    const [priceTemplateOptions, setPriceTemplateOptions] = useState<PriceTemplateOption[]>([]);

    const fetchPriceTemplates = useCallback(async () => {
        const result = await execute(() => priceTemplateService.getAllPriceTemplates());
        if (result && Array.isArray(result)) {
            setPriceTemplates(result);
        }
    }, [execute]);

    const fetchPriceTemplateOptions = useCallback(async () => {
        const result = await execute(() => priceTemplateService.getPriceTemplateOptions());
        if (result && Array.isArray(result)) {
            setPriceTemplateOptions(result);
        }
    }, [execute]);

    useEffect(() => {
        fetchPriceTemplates();
    }, [fetchPriceTemplates]);

    useEffect(() => {
        fetchPriceTemplateOptions();
    }, [fetchPriceTemplateOptions]);

    const createPriceTemplate = useCallback(
        async (payload: PriceTemplateUpsert) => {
            const result = await execute(() => priceTemplateService.createPriceTemplate(payload));
            if (result && Array.isArray(result)) {
                setPriceTemplates(result);
            }
        },
        [execute]
    );

    const updatePriceTemplate = useCallback(
        async (id: number, payload: PriceTemplateUpsert) => {
            const result = await execute(() => priceTemplateService.updatePriceTemplate(id, payload));
            if (result && Array.isArray(result)) {
                setPriceTemplates(result);
            }
        },
        [execute]
    );

    const deletePriceTemplate = useCallback(
        async (id: number) => {
            const result = await execute(() => priceTemplateService.deletePriceTemplate(id));
            if (result && Array.isArray(result)) {
                setPriceTemplates(result);
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
        priceTemplates,
        priceTemplateOptions,
        isTemplatesLoading,
        createPriceTemplate,
        updatePriceTemplate,
        deletePriceTemplate,
        refetch: fetchPriceTemplates,
    };
}