// 1. Frameworks & Libraries
import { useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

// 2. External Components
import useApi from "@/hooks/useApi";
import { type UserRole } from "@/types/user.types";
import { USER_ROLES } from "@/constants/role";
import { ROUTES } from "@/constants/route";
import { getErrorMessage } from "@/utils/errorHelpers";
import { useAuth } from "@/contexts/AuthContext";

// 3. Internal Components
import AuthSideLayout from "../components/layouts/AuthSideLayout";
import LoginForm from "../components/forms/LoginForm";

import type { LoginData } from "../types/auth.types";
import { authService } from "../services/authService";


export default function LoginPage() {
    const { role } = useOutletContext<{ role: UserRole }>();

    const { execute, isLoading } = useApi();
    const [apiError, setApiError] = useState<any>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = useCallback(async (data: LoginData) => {
        setApiError(null);

        const result = await execute(() => authService.login(data));

        if (!result?.success) {
            const errorDetail = getErrorMessage(result?.error);
            setApiError({ [errorDetail.field]: errorDetail.message });
            return;
        }

        const { accessToken, user } = result.data;

        login(accessToken, user, role);

        if (role === USER_ROLES.OWNER) {
            navigate(ROUTES.OWNER.HOME, { replace: true });
            return;
        }

        if (role === USER_ROLES.ADMIN) {
            navigate(ROUTES.DASHBOARD.ADMIN.HOME, { replace: true });
            return;
        }

        navigate(ROUTES.PUBLIC.HOME, { replace: true });
    }, [execute, login, navigate, role]);

    return (
        <AuthSideLayout>
            <LoginForm
                role={role}
                onSubmit={handleLogin}
                apiError={apiError}
                isLoading={isLoading}
            />
        </AuthSideLayout>
    );
}