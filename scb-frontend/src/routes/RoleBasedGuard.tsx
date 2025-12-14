import type { UserRole } from "@/types/user.types";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/route";
import { useEffect } from "react";

interface RoleBasedGuardProps {
    requiredRole?: UserRole;
    isPublic?: boolean;
};

export function RoleBasedGuard ({ requiredRole, isPublic }: RoleBasedGuardProps) {
    const { activeRole, user, isLoading, switchRole } = useAuth();
    const location = useLocation();

    // Step 1: Check if user is loading
    if (isLoading) return <div>Loading...</div>;

    // Step 2: Check if user is unauthenticated
    if (!user) {
        if (isPublic) return <Outlet />;
        const redirectPath = requiredRole ? ROUTES.AUTH.getLogin(requiredRole) : ROUTES.PUBLIC.HOME;
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    // Step 3: Check if no required role, allow access
    if (!requiredRole) return <Outlet />;

    // Step 4: Check if user has not required role
    const hasRequiredRole = user?.roles.some((role) => role.toLowerCase() === requiredRole?.toLowerCase());
    if (!hasRequiredRole) return <Navigate to={ROUTES.PUBLIC.HOME} replace />; // Future fix: Change to not found page

    // Step 5: Automatically switch role if needed
    if (activeRole !== requiredRole)
        return <RoleSwitcherTarget role={requiredRole} switchRole={switchRole} />;

    return <Outlet />;
};

const RoleSwitcherTarget = ({
    role,
    switchRole
}: {
    role: UserRole,
    switchRole: (role: UserRole) => void
}) => {
    useEffect(() => {switchRole(role)}, [role, switchRole]);
    return <div>Switching to {role}...</div>
}