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

        ADDRESS: {
            PROVINCES: '/public/address/provinces',
            DISTRICTS: (provinceCode: string) => `/public/address/districts/${provinceCode}`,
            WARDS: (districtCode: string) => `/public/address/wards/${districtCode}`,
        }
    },
    OWNER: {
        FACILITIES: {
            ROOT: '/owner/facilities',
            BY_ID: (id: number | string) => `/owner/facilities/${id}`,
            
            
            OPTIONS: '/owner/facilities/options',
        },

        COURTS: {
            ROOT: '/owner/courts',
            BY_ID: (id: number | string) => `/owner/courts/${id}`
        },
        
        PRICE_LISTS: {
            ROOT: '/owner/price-lists',
            OPTIONS: '/owner/price-lists/options',
            BY_ID: (id: number | string) => `/owner/price-lists/${id}`
        }
    },
    MEDIA: {
        UPLOAD: '/media'
    }
} as const;