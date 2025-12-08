import VerifyOtpForm from "../forms/VerifyOtpForm/VerifyOtpForm";
import { useRegisterContext } from "../../context/RegisterContext";
import { OTP_TYPE } from "../../constants/otpType";

export default function RegisterOtpStep() {
    const { registerData, verifyOtp, resendOtp, isLoading, apiErrors } = useRegisterContext();

    const handleVerify = async (code: string) => {
        await verifyOtp({contact: registerData.contact, type: OTP_TYPE.REGISTER, code });
    };

    const handleResend = async () => {
        await resendOtp(registerData.contact, OTP_TYPE.REGISTER);
    };

    return (
        <VerifyOtpForm
            contact={registerData.contact}
            isLoading={isLoading}
            onVerify={handleVerify}
            onResend={handleResend}
            apiError={apiErrors?.code}
        />
    );
}