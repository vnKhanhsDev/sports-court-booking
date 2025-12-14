import { VI_MESSAGES } from "@/constants/messages/vi";

type ErrorCode = keyof typeof VI_MESSAGES.ERROR;

export function getErrorMessage(error?: string) {
    const errorKey = error as ErrorCode;
    return VI_MESSAGES.ERROR[errorKey] ?? VI_MESSAGES.ERROR.UNKNOWN_ERROR;
}