import { generatePath } from "react-router-dom";
import { type UserRole } from "@/types/user.types";

export const ROUTES = {
    PUBLIC: {
        MARKETPLACE: {
            HOME: '/',
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

    PLAYER: {
        BOOKING: {
            CHECKOUT: '/courts/checkout',
            MY_BOOKINGS: '/player/booking/my-bookings'
        }
    },

    PAYMENT: {
        VNPAY_RETURN: '/payment/vnpay-return'
    },

    OWNER: {
        HOME: '/owner/dashboard',
        COURT: '/owner/dashboard/courts',
        PRICE_LIST: '/owner/dashboard/price-lists',
        BOOKING: '/owner/dashboard/bookings'
    },

    ADMIN: {
        HOME: '/admin/dashboard',
        COURTS: '/admin/courts',
    }
} as const;