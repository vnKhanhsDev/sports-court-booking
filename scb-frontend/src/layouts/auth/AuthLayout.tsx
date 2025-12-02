import { useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { type UserRole } from "@/types/user.types";
import { USER_ROLES } from "@/constants/role";
import { THEME } from "@/constants/theme";
import AuthHeader from "./AuthHeader";

const getAction = (pathname: string) => 
    pathname.split('/').pop()?.toUpperCase() || '';

export default function AuthLayout() {
    const { role } = useParams<{ role: UserRole }>();
    const location = useLocation();

    const isValidRole = role && Object.values(USER_ROLES).includes(role);
    const action = getAction(location.pathname);

    useEffect(() => {
        if (!isValidRole) console.log('Invalid role');
    }, [isValidRole]);

    const title = role && action ? 
            THEME.TITLE.AUTH[role][action as keyof typeof THEME.TITLE.AUTH[UserRole]] || '' : '';

    return (
        <>
            <AuthHeader title={title} />
            <main>
                <Outlet />
            </main>
        </>
    );
}