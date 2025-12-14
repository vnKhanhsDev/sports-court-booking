import { useState, useEffect } from "react";
import useApi from "@/hooks/useApi";
import type { SportPublicResponse } from "@/types/catalog.types";
import { catalogService } from "@/services/catalogService";

export default function useCatalog() {
    const { execute, isLoading } = useApi();
    
    const [catalog, setCatalog] = useState<SportPublicResponse[]>([]);

    useEffect(() => {
        const fetchCatalog = async () => {
            const result = await execute(() => catalogService.getCatalog());
            if (result && Array.isArray(result)) {
                setCatalog(result);
            }
        };
        fetchCatalog();
    }, [execute]);

    return { catalog, isLoading };
}

