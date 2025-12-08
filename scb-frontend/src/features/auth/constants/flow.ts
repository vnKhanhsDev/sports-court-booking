import { lazy } from "react";

export const AUTH_STEPS = {
    REGISTER_OTP: {
        TITLE: "Xác thực OTP",
        COMPONENT: lazy(() => import('../components/RegisterSteps/RegisterOtpStep'))
    },
    PERSONAL_INFO: {
        TITLE: 'Thông tin cá nhân',
        COMPONENT: lazy(() => import('../components/forms/PersonalInfoForm/PersonalInfoForm'))
    },
    CREATE_PASSWORD: {
        TITLE: 'Tạo mật khẩu',
        COMPONENT: lazy(() => import('../components/forms/CreatePasswordForm/CreatePasswordForm'))
    },
    SUCCESS: {
        TITLE: 'Thành công',
        COMPONENT: lazy(() => import('../components/forms/SuccessForm'))
    }
} as const;