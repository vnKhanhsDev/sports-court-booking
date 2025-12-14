import { createContext, useCallback, useContext, useEffect, useState, useMemo } from "react";
import type { UserRole, UserLoginResponse } from "@/types/user.types";
import { localStorageUtil } from "@/utils/localStorageUtil";

interface AuthContextValue {
    accessToken: string | null;
    activeRole: UserRole | null;
    user: UserLoginResponse | null;
    isLoading: boolean;
    login: (token: string, user: UserLoginResponse, activeRoleReq: UserRole) => void;
    switchRole: (role: UserRole) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [activeRole, setActiveRole] = useState<UserRole | null>(null);
    const [user, setUser] = useState<UserLoginResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const syncFromStorage = useCallback(() => {
        try {
            setAccessToken(localStorageUtil.get<string>("accessToken") ?? null);
            setActiveRole(localStorageUtil.get<UserRole>("activeRole") ?? null);
            setUser(localStorageUtil.get<UserLoginResponse>("user") ?? null);
        } catch (error) {
            console.log("Error syncing auth from storage:", error);
            localStorageUtil.clear();
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        syncFromStorage();
    }, [syncFromStorage]);

    const login = useCallback((token: string, user: UserLoginResponse, activeRoleReq: UserRole) => {
        const nextActiveRole = hasRole(user.roles, activeRoleReq) ? activeRoleReq : user.roles[0];

        setAccessToken(token);
        setActiveRole(nextActiveRole);
        setUser(user);

        localStorageUtil.set("accessToken", token);
        localStorageUtil.set("activeRole", nextActiveRole);
        localStorageUtil.set("user", user);
    }, []);

    const switchRole = useCallback((requestRole: UserRole) => {
        if (!user) return false;

        if (hasRole(user.roles, requestRole)) {
            if (activeRole === requestRole) return true;
            setActiveRole(requestRole);
            localStorageUtil.set("activeRole", requestRole);
            return true;
        } else {
            console.warn(`User does not have role ${requestRole}`);
            return false;
        }
    }, [user, activeRole]);

    const value = useMemo(() => ({
        accessToken,
        activeRole,
        user,
        isLoading,
        login,
        switchRole
    }), [accessToken, activeRole, user, isLoading, login, switchRole]);

    if (isLoading) return <div>Loading...</div>;    

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

function hasRole(roles: UserRole[], requestRole: UserRole): boolean {
    return roles.some((role) => role.toLowerCase() === requestRole.toLowerCase());
}
