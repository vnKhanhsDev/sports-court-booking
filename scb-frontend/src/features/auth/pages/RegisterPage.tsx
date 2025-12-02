import { useState } from "react";
import AuthSideLayout from "../components/layouts/AuthSideLayout";
import ContactInfoForm from "../components/forms/ContactInfoForm";

export default function RegisterPage() {
    const [steps, setSteps] = useState<string[]>([]);
    const [index, setIndex] = useState<number>(0);
    const currentStep = steps[index];

    if (steps.length === 0) {
        return (
            <AuthSideLayout>
                <ContactInfoForm />
            </AuthSideLayout>
        );
    }

    return (
        <div>
            <h1>RegisterPage</h1>
        </div>
    );
}