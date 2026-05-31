package com.example.scbbackend.modules.user_v2.enums;

import com.example.scbbackend.common.exception.AppException;
import com.example.scbbackend.common.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum UserRole {
    PLAYER,
    OWNER,
    ADMIN;

    public static UserRole fromString(String value, HttpServletRequest request) {
        try {
            return UserRole.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Role invalid: {}", e.getMessage());
            throw new AppException(ErrorCode.ROLE_INVALID, request);
        }
    }
}
