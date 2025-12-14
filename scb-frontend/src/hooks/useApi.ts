import { AxiosError } from "axios";
import { useCallback, useState } from "react";

export default function useApi() {
    const [isLoading, setIsLoading] = useState(false);

    const execute = useCallback(async (apiCall: () => Promise<any>) => {
        setIsLoading(true);

        try {
            return await apiCall();
        } catch (error) {
            console.log(error);
            const axiosError = error as AxiosError<any>;
            return axiosError.response?.data;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        execute
    }
}