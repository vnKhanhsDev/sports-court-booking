package com.example.scbbackend.modules.auth.enums;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum OtpChannel {
    EMAIL,
    PHONE;

    public static OtpChannel fromString(String value) {
        try {
            return OtpChannel.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Otp channel invalid {}", e.getMessage());
            throw e;
        }
    }
}
