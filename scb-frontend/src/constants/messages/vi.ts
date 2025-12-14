export const VI_MESSAGES = {
    ERROR: {
        'ACCOUNT_EXISTED': { message: "Tài khoản đã tồn tại", field: "contact" },
        'ACCOUNT_NOT_FOUND': { message: "Tài khoản không tồn tại", field: "contact" },
        'ACCOUNT_BANNED': { message: "Tài khoản đã bị khóa", field: "contact" },

        'OTP_INVALID': { message: "Mã OTP không hợp lệ", field: "code" },
        'OTP_EXPIRED': { message: "Mã OTP đã hết hạn", field: "code" },
        'OTP_MAX_ATTEMPTS': { message: "Mã OTP đã đạt số lần thử tối đa", field: "code" },
        'OTP_INCORRECT': { message: "Mã OTP không chính xác", field: "code" },

        'NETWORK_ERROR': { message: "Lỗi kết nối mạng, vui lòng kiểm tra lại đường truyền.", field: "_global" },
        'UNKNOWN_ERROR': { message: "Lỗi không xác định, vui lòng thử lại sau.", field: "_global" },
    },
    SUCCESS: {

    }
} as const;