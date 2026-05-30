package com.example.scbbackend.modules.user.enums;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum UserRole {
    ADMIN,
    OWNER,
    PLAYER;

    public static UserRole fromString(String value) {
        try {
            return UserRole.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Role invalid: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_CREDENTIALS, null);
        }
    }
}
