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
        FACILITIES: {
            OPTIONS: '/owner/facilities/options',
        },
        COURTS: '/owner/courts',
        
        PRICE_TEMPLATES: {
            ROOT: '/owner/price-templates',

            OPTIONS: '/owner/price-templates/options',

            BY_ID: (id: number | string) => `/owner/price-templates/${id}`,
            ITEMS: (id: number | string) => `/owner/price-templates/${id}/items`
        }
    },
    MEDIA: {
        UPLOAD: '/media'
    }
} as const;