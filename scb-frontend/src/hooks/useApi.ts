import { AxiosError } from "axios";
import { useCallback, useState } from "react";

export default function useApi() {
    const [isLoading, setIsLoading] = useState(false);

    const execute = useCallback(async (
        apiCall: () => Promise<any>,
        options: {
            onSuccess?: (data: any) => void,
            onError?: (error: any) => void
        }
    ) => {
        setIsLoading(true);

        try {
            const response = await apiCall();

            options.onSuccess?.(response);

            return response;
        } catch (error) {
            const axiosError = error as AxiosError<any>;

            options.onError?.(axiosError);

            return { error: axiosError.response?.data };
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        execute
    }
}