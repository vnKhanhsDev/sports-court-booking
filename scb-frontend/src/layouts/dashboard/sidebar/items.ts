import { USER_ROLES } from "@/constants/role";
import { ROUTES } from "@/constants/route";
import { type UserRole } from "@/types/user.types";

export type SidebarItem = {
    label: string;
    path: string;
};

export type SidebarItemsByRole = Partial<Record<UserRole, SidebarItem[]>>;

export const SIDEBAR_ITEMS: SidebarItemsByRole = {
    [USER_ROLES.ADMIN]: [
        {
            label: 'Trang chủ',
            path: ROUTES.DASHBOARD.ADMIN.HOME
        }
    ],

    [USER_ROLES.OWNER]: [
        {
            label: 'Trang chủ',
            path: ROUTES.OWNER.HOME
        },
        {
            label: 'Quản lý sân',
            path: ROUTES.OWNER.COURT
        },
        {
            label: 'Quản lý bảng giá',
            path: ROUTES.OWNER.PRICE_TEMPLATE
        },
        {
            label: 'Quản lý lịch đặt sân',
            path: ROUTES.OWNER.BOOKING
        }
    ]
};