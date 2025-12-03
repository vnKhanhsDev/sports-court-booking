import { lazy } from "react";

export const AUTH_STEPS = {
    OTP: {
        TITLE: 'Xác thực OTP',
        COMPONENT: lazy(() => import('../components/forms/VerifyOtpForm'))
    },
    PERSONAL_INFO: {
        TITLE: 'Thông tin cá nhân',
        COMPONENT: lazy(() => import('../components/forms/UserInfoForm'))
    },
    CREATE_PASSWORD: {
        TITLE: 'Tạo mật khẩu',
        COMPONENT: lazy(() => import('../components/forms/CreatePasswordForm'))
    },
    SUCCESS: {
        TITLE: 'Thành công',
        COMPONENT: lazy(() => import('../components/forms/SuccessForm'))
    }
} as const;