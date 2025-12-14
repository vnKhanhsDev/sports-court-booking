export const ENDPOINTS = {
    AUTH: {
        REGISTER: {
            BASE: '/auth/register',
            ADD_ROLE: '/auth/register/new-role',
            AVAILABILITY: '/auth/register/availability'
        },
        LOGIN: '/auth/login',
        FORGOT_PASSWORD: '/auth/forgot-password',
        LOGOUT: '/auth/logout',
        VERIFY_OTP: '/auth/verify-otp',
        RESEND_OTP: '/auth/resend-otp',
        REFRESH_TOKEN: '/auth/refresh-token'
    },
    PUBLIC: {
        CATALOG: '/public/catalog',
    },
    OWNER: {
        COURTS: '/owner/courts',
        PRICE_TEMPLATES: '/owner/courts/price-templates'
    },
    MEDIA: {
        UPLOAD: '/media'
    }
} as const;