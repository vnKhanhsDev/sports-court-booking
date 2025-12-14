import { publicClient } from "@/lib/axios";
import type { UserRole } from "@/types/user.types";
import { ENDPOINTS } from "@/constants/endpoint";
import type { VerifyOtpData, OtpType, RegisterData, LoginData } from "../types/auth.types";

export const authService = {
    login: async (data: LoginData) => {
        const response = await publicClient.post(ENDPOINTS.AUTH.LOGIN, data);
        return response.data;
    },

    registerNewAccount: async (data: RegisterData) => {
        const response = await publicClient.post(ENDPOINTS.AUTH.REGISTER.BASE, data);
        return response.data;
    },

    registerNewRole: async (accountId: string, role: UserRole) => {
        const response = await publicClient.post(
            ENDPOINTS.AUTH.REGISTER.ADD_ROLE,
            { accountId, role }
        );
        return response.data;
    },

    checkRegisterAvailability: async (contact: string, role: UserRole) => {
        const response = await publicClient.get(
            ENDPOINTS.AUTH.REGISTER.AVAILABILITY,
            { params: { contact, role } }
        );
        return response.data;
    },

    verifyOtp: async (data: VerifyOtpData) => {
        const response = await publicClient.post(
            ENDPOINTS.AUTH.VERIFY_OTP,
            data
        );
        return response.data;
    },

    resendOtp: async (contact: string, type: OtpType) => {
        const response = await publicClient.post(
            ENDPOINTS.AUTH.RESEND_OTP,
            null,
            { params: { contact, type } }
        );
        return response.data;
    },
}