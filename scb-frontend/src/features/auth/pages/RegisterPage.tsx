import { Suspense, useState } from "react";
import { useOutletContext } from "react-router-dom";
import AuthSideLayout from "../components/layouts/AuthSideLayout";
import AuthFlowLayout from "../components/layouts/AuthFlowLayout";
import ContactInfoForm from "../components/forms/ContactInfoForm";
import { type UserRole } from "@/types/user.types";
import { AUTH_STEPS } from "../constants/flow";
import useRegister from "../hooks/useRegister";
import useAuthFlow from "../hooks/useAuthFlow";

export default function RegisterPage() {
    const { role } = useOutletContext<{ role: UserRole }>();
    const { steps, setSteps, index, nextStep } = useAuthFlow();
    const currentStep = steps[index];

    const { isLoading, checkAccountAvailability } = useRegister();
    const [apiErrors, setApiErrors] = useState<Record<string, string | string[]> | undefined>(undefined);

    const handleSubmit = async (data: { contact: string }) => {
        const result = await checkAccountAvailability(data.contact, role);

        if (result?.apiErrors) {
            setApiErrors({ contact: result.apiErrors.message });
            return;
        }

        if (result?.data) {
            setSteps(result.data.steps);
        }

        setApiErrors(undefined);
    };

    if (steps.length === 0) {
        return (
            <AuthSideLayout>
                <ContactInfoForm
                    role={role}
                    onSubmit={handleSubmit}
                    apiErrors={apiErrors}
                />
            </AuthSideLayout>
        );
    }

    const StepComponent = AUTH_STEPS[currentStep as keyof typeof AUTH_STEPS].COMPONENT;

    return (
        <AuthFlowLayout steps={steps} currentStep={index}>
            <Suspense fallback={<div>Đang tải bước...</div>}>
                <StepComponent onNext={nextStep} />
            </Suspense>
        </AuthFlowLayout>
    );
}