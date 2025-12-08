import { Suspense } from "react";
import { useOutletContext } from "react-router-dom";
import AuthSideLayout from "../components/layouts/AuthSideLayout";
import AuthFlowLayout from "../components/layouts/AuthFlowLayout";
import ContactInfoForm from "../components/forms/ContactInfoForm";
import { type UserRole } from "@/types/user.types";
import { AUTH_STEPS } from "../constants/flow";
import { useRegisterContext } from "../context/RegisterContext";
import { RegisterProvider } from "../context/RegisterContext";

function RegisterContent({ role }: { role: UserRole }) {
    const { steps, currentStepIndex } = useRegisterContext();

    if (steps.length === 0) {
        return (
            <AuthSideLayout>
                <ContactInfoForm role={role} />
            </AuthSideLayout>
        );
    };

    const currentStepKey = steps[currentStepIndex];
    const StepComponent = AUTH_STEPS[currentStepKey as keyof typeof AUTH_STEPS]?.COMPONENT;

    if (!StepComponent) {
        return <div>Step not found</div>;
    };

    return (
        <AuthFlowLayout steps={steps} currentStep={currentStepIndex}>
            <Suspense fallback={<div>Đang tải bước...</div>}>
                <StepComponent />
            </Suspense>
        </AuthFlowLayout>
    );
};

export default function RegisterPage() {
    const { role } = useOutletContext<{ role: UserRole }>();

    return (
        <RegisterProvider>
            <RegisterContent role={role} />
        </RegisterProvider>
    );
};