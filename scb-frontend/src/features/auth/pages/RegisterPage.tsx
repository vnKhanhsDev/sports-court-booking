import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import AuthSideLayout from "../components/layouts/AuthSideLayout";
import ContactInfoForm from "../components/forms/ContactInfoForm";
import { type UserRole } from "@/types/user.types";

export default function RegisterPage() {
    const { role } = useOutletContext<{ role: UserRole }>();

    const [steps, setSteps] = useState<string[]>([]);
    const [index, setIndex] = useState<number>(0);
    const currentStep = steps[index];

    if (steps.length === 0) {
        return (
            <AuthSideLayout>
                <ContactInfoForm role={role} />
            </AuthSideLayout>
        );
    }

    return (
        <div>
            <h1>RegisterPage</h1>
        </div>
    );
}