// 1. Framework & Libraries
import { useEffect, useState, useMemo } from "react";

// 2. Internal Shared Components
import Button from "@/components/ui/button/Button";

// 3. Relative Components
import AuthFlowHeader from "../../layouts/AuthFlowHeader";
import OtpInput from "./OtpInput";

// 4. Styles
import styles from "../AuthForm.module.css";

interface VerifyOtpFormProps {
    contact: string;
    isLoading: boolean;
    apiError?: string;
    onVerify: (code: string) => Promise<void>;
    onResend: () => Promise<void>;
}

export default function VerifyOtpForm({
    contact,
    isLoading,
    apiError,
    onVerify,
    onResend
}: VerifyOtpFormProps) {
    const [code, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(60);
    const [localError, setLocalError] = useState<string | undefined>(undefined);
    
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => setLocalError(apiError), [apiError]);

    const handleChange = (newCode: string) => {
        setCode(newCode);
        localError && setLocalError(undefined);
    };

    const handleResend = async () => {
        if (timeLeft > 0) return;
        
        setCode('');
        setLocalError(undefined);
        setTimeLeft(60);
        
        await onResend();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (code.length !== 6) return;
        await onVerify(code);
    };

    const buttonDisabled = code.length !== 6 || isLoading;
    const displayError = localError;

    return (
        <>
            <AuthFlowHeader title="Nhập mã xác nhận" onBack={() => {}} />

            <form className="px-15 mt-8" onSubmit={handleSubmit}>
                <div className='text-center'>
                    <p className="text-gray-500">Mã xác minh của bạn đã được gửi đến</p>
                    <p>{contact || 'test@example.com'}</p>
                </div>

                <OtpInput
                    length={6}
                    value={code}
                    onChange={handleChange}
                    error={displayError}
                />

                <div className="mt-5 mb-10 text-center">
                    {timeLeft > 0 ? (
                        <p className="text-gray-500">Vui lòng chờ <span className={styles.timeLeft}>{timeLeft}</span> giây để gửi lại</p>
                    ) : (
                        <div className="flex items-center justify-center gap-1">
                            <p className="text-gray-500">Bạn chưa nhận được mã?</p>
                            <button type="button" onClick={handleResend}>Gửi lại</button>
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    label="Xác nhận"
                    disabled={buttonDisabled}
                    className={styles.submitBtn}
                />
            </form>
        </>
    );
}