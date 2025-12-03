package com.example.scbbackend.modules.auth.enums;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum OtpType {
    REGISTER,
    FORGOT_PASSWORD;

    public static OtpType fromString(String value) {
        try {
            return OtpType.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Otp channel invalid {}", e.getMessage());
            throw e;
        }
    }
}
