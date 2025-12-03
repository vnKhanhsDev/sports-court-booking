import { useCallback } from "react";
import type { UserRole } from "@/types/user.types";
import { authService } from "../services/authService";
import useApi from "@/hooks/useApi";

export default function useRegister() {
    const { isLoading, execute } = useApi();

    const checkAccountAvailability = useCallback(async (contact: string, role: UserRole) => {
        const result = await execute(
            () => authService.checkAccountAvailability(contact, role), {
                onSuccess: (data) => console.log(data)
            }
        );

        if (result?.error) {
            if (result.error.errors) 
                return { apiErrors: result.error.errors };

            return { apiErrors: result.error };
        }

        return { data: result?.data };
    }, [execute]);

    return {
        isLoading,
        checkAccountAvailability
    }
}