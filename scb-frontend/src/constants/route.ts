import { generatePath } from "react-router-dom";
import { type UserRole } from "@/types/user.types";

export const ROUTES = {
    PUBLIC: {
        HOME: '/',
        COURTS: {
            SEARCH: '/courts/search',
            DETAIL: '/courts/:id'
        }
    },

    AUTH: {
        REGISTER_TEMPLATE: '/:role/register',
        LOGIN_TEMPLATE: '/:role/login',
        FORGOT_PASSWORD_TEMPLATE: '/:role/forgot-password',

        getRegister: (role: UserRole) => generatePath(ROUTES.AUTH.REGISTER_TEMPLATE, { role }),
        getLogin: (role: UserRole) => generatePath(ROUTES.AUTH.LOGIN_TEMPLATE, { role }),
        getForgotPassword: (role: UserRole) => generatePath(ROUTES.AUTH.FORGOT_PASSWORD_TEMPLATE, { role })
    },

    OWNER: {
        HOME: '/owner/dashboard',
        COURT: '/owner/dashboard/courts',
        PRICE_LIST: '/owner/dashboard/price-lists',
        BOOKING: '/owner/dashboard/bookings'
    },

    DASHBOARD: {
        OWNER: {
            HOME: '/dashboard/owner',
            COURTS: '/dashboard/owner/courts',
            BOOKINGS: '/dashboard/owner/bookings',
        },
        ADMIN: {
            HOME: '/dashboard/admin',
            COURTS: '/dashboard/admin/courts'
        }
    }
} as const;