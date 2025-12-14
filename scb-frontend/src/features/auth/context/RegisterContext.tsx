import { createContext, useContext, useCallback, useState } from "react";
import useApi from "@/hooks/useApi";
import type { RegisterContextType, RegisterData, VerifyOtpData, RegisterOtpVerifiedUser } from "../types/auth.types";
import type { UserRole } from "@/types/user.types";
import { authService } from "../services/authService";
import type { OtpType } from "../types/auth.types";
import { getErrorMessage } from "@/utils/errorHelpers";

const RegisterContext = createContext<RegisterContextType | null>(null);

export const RegisterProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLoading, execute } = useApi();

    const [steps, setSteps] = useState<string[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [apiErrors, setApiErrors] = useState<any>(null);

    const [registerData, setRegisterData] = useState<RegisterData>({
        contact: "",
        role: null,
        fullName: "",
        gender: "",
        dob: "",
        password: ""
    });
    const [registerOtpVerifiedUser, setRegisterOtpVerifiedUser] = useState<RegisterOtpVerifiedUser | null>(null);

    // ======================
    //    REGISTER ACTIONS   
    // ======================
    /**
     *  Action 1: Check account availability
     *  @param contact - The contact to check
     *  @param role - The role to check
     *  @returns void
     */
    const initFlow = useCallback(async (contact: string, role: UserRole) => {
        setApiErrors(null);

        const result = await execute(() => authService.checkRegisterAvailability(contact, role));

        if (!result.success) {
            const errorDetail = getErrorMessage(result.error);
            setApiErrors({ [errorDetail.field]: errorDetail.message });
            return;
        }

        if (result.data) {
            setSteps(result.data.steps || []);
            setRegisterData(prev => ({ ...prev, contact, role }));
        }
    }, [execute]);

    /**
     *  Action 2: Verify OTP
     *  @param data - The data to verify OTP (contact, type, code)
     *  @returns void
     */
    const verifyOtp = useCallback(async (data: VerifyOtpData) => {
        setApiErrors(null);

        const result = await execute(() => authService.verifyOtp(data));
        console.log(result);

        if (!result.success) {
            setApiErrors({ code: getErrorMessage(result.code) });
            return;
        }

        setRegisterOtpVerifiedUser(result.data);

        setCurrentStepIndex(prev => prev + 1);
    }, [execute, registerData]);

    /**
     *  Action 3: Resend OTP
     *  @param contact - The contact to resend OTP
     *  @param type - The type of OTP to resend
     *  @returns void
     */
    const resendOtp = useCallback(async (contact: string, type: OtpType) => {
        setApiErrors(null);
        console.log(contact, type);

        const result = await execute(() => authService.resendOtp(contact, type));
        if (!result.success) {
            setApiErrors({ code: getErrorMessage(result.code) });
            return;
        }
    }, [execute]);

    /**
     *  Action 4: Handle personal info
     *  @param fullName - The full name of the user
     *  @param gender - The gender of the user
     *  @param dob - The date of birth of the user
     *  @returns void
     */
    const handlePersonalInfo = useCallback(async (fullName: string, gender: string, dob: string) => {
        setRegisterData(prev => ({ ...prev, fullName, gender, dob }));

        if (registerOtpVerifiedUser !== null) {
            const result = await execute(() => authService.registerNewRole(registerOtpVerifiedUser.accountId, registerData.role as UserRole));
            if (!result.success) {
                console.log(result);
                return;
            }
        }

        setCurrentStepIndex(prev => prev + 1);
    }, [registerData.role, registerOtpVerifiedUser, execute]);

    /**
     *  Action 5: Handle create password
     *  @param password - The password of the user
     *  @returns void
     */
    const handleCreatePassword = useCallback(async (password: string) => {
        const data = { ...registerData, password };

        const result = await execute(() => authService.registerNewAccount(data));
        if (!result.success) {
            console.log(result);
            return;
        }

        setCurrentStepIndex(prev => prev + 1);
    }, [execute, registerData]);

    return (
        <RegisterContext.Provider value={{
            steps,
            currentStepIndex,
            isLoading,
            apiErrors,
            registerData,
            registerOtpVerifiedUser,
            initFlow,
            verifyOtp,
            resendOtp,
            handlePersonalInfo,
            handleCreatePassword
        }}>
            {children}
        </RegisterContext.Provider>
    );
};

export const useRegisterContext = () => {
    const context = useContext(RegisterContext);
    if (!context) throw new Error("useRegisterContext must be used within a RegisterProvider");
    return context;
};