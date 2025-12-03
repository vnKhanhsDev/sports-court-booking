import { useOutletContext } from "react-router-dom";
import AuthSideLayout from "../components/layouts/AuthSideLayout";
import LoginForm from "../components/forms/LoginForm";
import { type UserRole } from "@/types/user.types";

export default function LoginPage() {
    const { role } = useOutletContext<{ role: UserRole }>();

    return (
        <AuthSideLayout>
            <LoginForm role={role} />
        </AuthSideLayout>
    );
}