import { USER_ROLES } from "@/constants/role";

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];