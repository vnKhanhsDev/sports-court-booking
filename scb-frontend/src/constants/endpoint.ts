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

    ADMIN: {
        FACILITIES: {
            ROOT: '/admin/facilities',
            APPROVE: (id: number | string) => `/admin/facilities/${id}/approve`,
            REJECT: (id: number | string) => `/admin/facilities/${id}/reject`,
            APPROVE_ALL: '/admin/facilities/approve-all'
        },
        COURTS: {
            ROOT: '/admin/courts',
            BY_ID: (id: number | string) => `/admin/courts/${id}`
        }
    },
    
    MEDIA: {
        UPLOAD: '/media'
    }
} as const;