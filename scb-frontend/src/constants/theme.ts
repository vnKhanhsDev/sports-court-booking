import { USER_ROLES } from "@/constants/role";

export const THEME = {
    TITLE: {
        AUTH: {
            [USER_ROLES.ADMIN]: {
                LOGIN: 'Kênh Quản trị viên'
            },
            [USER_ROLES.OWNER]: {
                REGISTER: 'Trở thành Chủ sân',
                LOGIN: 'Kênh Chủ sân',
            },
            [USER_ROLES.PLAYER]: {
                REGISTER: 'Đăng ký',
                LOGIN: 'Đăng nhập',
            }
        }
    }
} as const;