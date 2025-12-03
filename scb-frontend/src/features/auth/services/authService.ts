import { publicClient } from "@/lib/axios";
import type { UserRole } from "@/types/user.types";
import { ENDPOINTS } from "@/constants/endpoint";

export const authService = {
    checkAccountAvailability: async (contact: string, role: UserRole) => {
        const response = await publicClient.get(
            ENDPOINTS.AUTH.REGISTER.AVAILABILITY,
            { params: { contact, role } }
        );
        return response.data;
    }
}