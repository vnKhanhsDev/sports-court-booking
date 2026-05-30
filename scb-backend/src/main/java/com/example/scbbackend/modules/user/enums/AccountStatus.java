package com.example.scbbackend.modules.user.enums;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public enum AccountStatus {
    ACTIVE,
    LOCKED,
    BANNED;

    public static AccountStatus fromString(String value) {
        try {
            return AccountStatus.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            log.error("Account status invalid: {}", e.getMessage());
            throw e;
        }
    }
}
