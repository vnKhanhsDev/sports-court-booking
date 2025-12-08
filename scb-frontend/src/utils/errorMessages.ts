import { VI_MESSAGES } from "@/constants/messages";

export const getErrorMessage = (code: number) => 
    VI_MESSAGES.ERRORS[code as keyof typeof VI_MESSAGES.ERRORS] ?? 
    "Lỗi không xác định";