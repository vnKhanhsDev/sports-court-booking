import type { UserRole } from "@/types/user.types";
import type { OTP_TYPE } from "../constants/otpType";

export type OtpType = (typeof OTP_TYPE)[keyof typeof OTP_TYPE];

export interface LoginData {
    contact: string;
    role: UserRole;
    password: string;
};

export interface VerifyOtpData {
    contact: string;
    type: OtpType;
    code: string;
};

export interface RegisterData {
    contact: string;
    role: UserRole | null;
    fullName: string;
    gender: string;
    dob: string;
    password: string;
};

export interface RegisterOtpVerifiedUser {
    accountId: string;
    fullName: string;
    gender: string;
    dob: string;
};

export interface RegisterContextType {
    // State
    steps: string[];
    currentStepIndex: number;
    isLoading: boolean;
    apiErrors: any;

    // Data Logic
    registerData: RegisterData;
    registerOtpVerifiedUser: RegisterOtpVerifiedUser | null;

    // Actions
    initFlow: (contact: string, role: UserRole) => Promise<void>;
    verifyOtp: (data: VerifyOtpData) => Promise<void>;
    resendOtp: (contact: string, type: OtpType) => Promise<void>;
    handlePersonalInfo: (fullName: string, gender: string, dob: string) => void;
    handleCreatePassword: (password: string) => void;
};