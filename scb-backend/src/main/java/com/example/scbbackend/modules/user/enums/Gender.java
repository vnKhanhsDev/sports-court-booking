package com.example.scbbackend.modules.user.enums;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum Gender {
    MALE,
    FEMALE,
    OTHER;

    public static Gender fromString(String value) {
        try {
            return Gender.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Gender invalid: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, null);
        }
    }
}
